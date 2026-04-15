const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } = require('../utils/errors');

const prisma = new PrismaClient();

/**
 * Register a new user and optionally create an organization
 */
async function register({ email, password, name, organizationName, organizationSlug }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Check if organization slug already exists
    const existingOrg = await prisma.organization.findUnique({ where: { slug: organizationSlug } });
    if (existingOrg) {
        throw new ConflictError('Organization slug already taken');
    }

    // Create organization and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
            data: {
                name: organizationName,
                slug: organizationSlug,
            },
        });

        const user = await tx.user.create({
            data: {
                email,
                passwordHash,
                name,
                role: 'ADMIN', // First user in org is always admin
                organizationId: organization.id,
            },
        });

        return { user, organization };
    });

    const tokens = generateTokenPair(result.user);

    return {
        user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            organization: {
                id: result.organization.id,
                name: result.organization.name,
                slug: result.organization.slug,
            },
        },
        ...tokens,
    };
}

/**
 * Login with email and password
 */
async function login({ email, password }) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    if (!user || !user.passwordHash) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = generateTokenPair(user);

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            organization: user.organization,
        },
        ...tokens,
    };
}

/**
 * Refresh access token using refresh token
 */
async function refreshToken(token) {
    try {
        const decoded = verifyRefreshToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { organization: { select: { id: true, name: true, slug: true } } },
        });

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        const tokens = generateTokenPair(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
            },
            ...tokens,
        };
    } catch (error) {
        throw new UnauthorizedError('Invalid refresh token');
    }
}

/**
 * Handle Google OAuth — find or create user
 */
async function googleAuth({ googleId, email, name }) {
    // Check if user exists with this Google ID
    let user = await prisma.user.findUnique({
        where: { googleId },
        include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    if (user) {
        const tokens = generateTokenPair(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
            },
            ...tokens,
        };
    }

    // Check if user exists with this email
    user = await prisma.user.findUnique({
        where: { email },
        include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    if (user) {
        // Link Google ID to existing account
        user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
            include: { organization: { select: { id: true, name: true, slug: true } } },
        });

        const tokens = generateTokenPair(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
            },
            ...tokens,
        };
    }

    // Create new user with a personal organization
    const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-org';
    const result = await prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
            data: {
                name: `${name}'s Organization`,
                slug: slug + '-' + Date.now().toString(36),
            },
        });

        const newUser = await tx.user.create({
            data: {
                email,
                name,
                googleId,
                role: 'ADMIN',
                organizationId: organization.id,
            },
        });

        return { user: newUser, organization };
    });

    const tokens = generateTokenPair(result.user);

    return {
        user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            organization: {
                id: result.organization.id,
                name: result.organization.name,
                slug: result.organization.slug,
            },
        },
        ...tokens,
    };
}

/**
 * Add a member to an organization (admin only)
 */
async function addMember({ email, password, name, organizationId }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
            role: 'MEMBER',
            organizationId,
        },
        include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
    };
}

/**
 * Handle GitHub OAuth — find or create user
 */
async function githubAuth({ githubId, email, name }) {
    // Check if user exists with this GitHub ID
    let user = await prisma.user.findUnique({
        where: { githubId },
        include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    if (user) {
        const tokens = generateTokenPair(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
            },
            ...tokens,
        };
    }

    // Check if user exists with this email
    user = await prisma.user.findUnique({
        where: { email },
        include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    if (user) {
        // Link GitHub ID to existing account
        user = await prisma.user.update({
            where: { id: user.id },
            data: { githubId },
            include: { organization: { select: { id: true, name: true, slug: true } } },
        });

        const tokens = generateTokenPair(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
            },
            ...tokens,
        };
    }

    // Create new user with a personal organization
    const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-org';
    const result = await prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
            data: {
                name: `${name}'s Organization`,
                slug: slug + '-' + Date.now().toString(36),
            },
        });

        const newUser = await tx.user.create({
            data: {
                email,
                name,
                githubId,
                role: 'ADMIN',
                organizationId: organization.id,
            },
        });

        return { user: newUser, organization };
    });

    const tokens = generateTokenPair(result.user);

    return {
        user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            organization: {
                id: result.organization.id,
                name: result.organization.name,
                slug: result.organization.slug,
            },
        },
        ...tokens,
    };
}

module.exports = {
    register,
    login,
    refreshToken,
    googleAuth,
    githubAuth,
    addMember,
};
