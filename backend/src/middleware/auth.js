const { verifyAccessToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Authentication middleware
 * Verifies JWT from Authorization header and attaches user to request
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Access token is required');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                organizationId: true,
                organization: { select: { id: true, name: true, slug: true } },
            },
        });

        if (!user) {
            throw new UnauthorizedError('User no longer exists');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new UnauthorizedError('Invalid token'));
        } else if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError('Token expired'));
        } else {
            next(error);
        }
    }
}

module.exports = { authenticate };
