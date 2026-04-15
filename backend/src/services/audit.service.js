const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Log an audit action
 */
async function logAction({ action, taskId, taskTitle, performedBy, organizationId, changes }) {
    return prisma.auditLog.create({
        data: {
            action,
            taskId,
            taskTitle,
            performedBy,
            organizationId,
            changes: changes || {},
        },
    });
}

/**
 * Get audit logs for an organization
 */
async function getAuditLogs({ organizationId, taskId, page = 1, limit = 50 }) {
    const where = { organizationId };
    if (taskId) where.taskId = taskId;

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                task: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit),
        }),
        prisma.auditLog.count({ where }),
    ]);

    return {
        logs,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

module.exports = {
    logAction,
    getAuditLogs,
};
