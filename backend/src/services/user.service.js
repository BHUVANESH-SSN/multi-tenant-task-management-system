const { PrismaClient } = require('@prisma/client');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

const prisma = new PrismaClient();

/**
 * Get all users in an organization
 */
async function getUsers({ organizationId, page = 1, limit = 50 }) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: { organizationId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                _count: { select: { createdTasks: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit),
        }),
        prisma.user.count({ where: { organizationId } }),
    ]);

    return {
        users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Update a user's role (admin only)
 */
async function updateUserRole({ userId, organizationId, role, requestingUserId }) {
    const user = await prisma.user.findFirst({
        where: { id: userId, organizationId },
    });

    if (!user) {
        throw new NotFoundError('User not found in your organization');
    }

    // Prevent admin from changing their own role
    if (userId === requestingUserId) {
        throw new ForbiddenError('You cannot change your own role');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });

    return updatedUser;
}

/**
 * Remove a user from an organization
 */
async function removeUser({ userId, organizationId, requestingUserId }) {
    const user = await prisma.user.findFirst({
        where: { id: userId, organizationId },
    });

    if (!user) {
        throw new NotFoundError('User not found in your organization');
    }

    // Prevent self-removal
    if (userId === requestingUserId) {
        throw new ForbiddenError('You cannot remove yourself');
    }

    await prisma.user.delete({ where: { id: userId } });

    return { message: 'User removed successfully' };
}

/**
 * Get current user profile
 */
async function getProfile(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            organization: { select: { id: true, name: true, slug: true } },
            _count: { select: { createdTasks: true, assignedTasks: true } },
        },
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
}

module.exports = {
    getUsers,
    updateUserRole,
    removeUser,
    getProfile,
};
