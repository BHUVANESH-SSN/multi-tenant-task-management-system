const auditService = require('../services/audit.service');

async function getAuditLogs(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await auditService.getAuditLogs({
            organizationId: req.organizationId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function getTaskAuditLogs(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await auditService.getAuditLogs({
            organizationId: req.organizationId,
            taskId: req.params.taskId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { getAuditLogs, getTaskAuditLogs };
