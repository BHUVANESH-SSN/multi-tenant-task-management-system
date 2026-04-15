/**
 * Tenant isolation middleware
 * Attaches organizationId from authenticated user to the request
 * All downstream queries should scope by this value
 */
function tenantIsolation(req, res, next) {
    if (!req.user || !req.user.organizationId) {
        return res.status(403).json({ error: 'Tenant context not available' });
    }

    req.organizationId = req.user.organizationId;
    next();
}

module.exports = { tenantIsolation };
