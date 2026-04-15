const { ForbiddenError } = require('../utils/errors');

/**
 * Role-based access control middleware factory
 * @param  {...string} allowedRoles - Roles that are permitted (e.g., 'ADMIN', 'MEMBER')
 */
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ForbiddenError('Authentication required'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError(`Role '${req.user.role}' is not authorized for this action`));
        }

        next();
    };
}

module.exports = { authorize };
