const { AppError } = require('../utils/errors');
const config = require('../config');

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
    // Always log errors to CloudWatch for debugging
    console.error('Error:', err);

    // Handle known operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // Handle Prisma known errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'A record with this value already exists',
            field: err.meta?.target,
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Record not found',
        });
    }

    // Handle unknown errors
    res.status(500).json({
        error: err.message || 'Internal server error',
    });
}

module.exports = { errorHandler };
