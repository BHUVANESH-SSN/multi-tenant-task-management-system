const { PrismaClient } = require('@prisma/client');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const auditService = require('./audit.service');

const prisma = new PrismaClient();

/**
 * Create a new task
 */
async function createTask({ title, description, status, priority, dueDate, assignedTo, organizationId, userId }) {
    // If assignedTo is specified, verify the user belongs to the same org
    if (assignedTo) {
        const assignee = await prisma.user.findFirst({
            where: { id: assignedTo, organizationId },
        });
        if (!assignee) {
            throw new NotFoundError('Assigned user not found in your organization');
        }
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            status: status || 'TODO',
            priority: priority || 'MEDIUM',
            dueDate: dueDate ? new Date(dueDate) : null,
            assignedTo,
            organizationId,
            createdBy: userId,
        },
        include: {
            creator: { select: { id: true, name: true, email: true } },
            assignee: { select: { id: true, name: true, email: true } },
        },
    });

    // Log the task creation
    await auditService.logAction({
        action: 'CREATED',
        taskId: task.id,
        taskTitle: task.title,
        performedBy: userId,
        organizationId,
        changes: { title, description, status: task.status, priority: task.priority },
    });

    return task;
}

/**
 * Get all tasks for an organization (with optional filters)
 */
async function getTasks({ organizationId, status, priority, assignedTo, createdBy, page = 1, limit = 20 }) {
    const where = { organizationId };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (createdBy) where.createdBy = createdBy;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where,
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignee: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit),
        }),
        prisma.task.count({ where }),
    ]);

    return {
        tasks,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get a single task by ID (org-scoped)
 */
async function getTaskById({ taskId, organizationId }) {
    const task = await prisma.task.findFirst({
        where: { id: taskId, organizationId },
        include: {
            creator: { select: { id: true, name: true, email: true } },
            assignee: { select: { id: true, name: true, email: true } },
        },
    });

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    return task;
}

/**
 * Update a task (admin: any task, member: own tasks)
 */
async function updateTask({ taskId, organizationId, userId, userRole, data }) {
    const task = await prisma.task.findFirst({
        where: { id: taskId, organizationId },
    });

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    // Members can only update their own tasks or tasks assigned to them
    if (userRole === 'MEMBER' && task.createdBy !== userId && task.assignedTo !== userId) {
        throw new ForbiddenError('You can only update tasks you created or are assigned to you');
    }

    // If assignedTo is being changed, verify the new assignee belongs to the same org
    if (data.assignedTo) {
        const assignee = await prisma.user.findFirst({
            where: { id: data.assignedTo, organizationId },
        });
        if (!assignee) {
            throw new NotFoundError('Assigned user not found in your organization');
        }
    }

    // Build changes object for audit log
    const changes = {};
    if (data.title && data.title !== task.title) changes.title = { from: task.title, to: data.title };
    if (data.description !== undefined && data.description !== task.description) changes.description = { from: task.description, to: data.description };
    if (data.status && data.status !== task.status) changes.status = { from: task.status, to: data.status };
    if (data.priority && data.priority !== task.priority) changes.priority = { from: task.priority, to: data.priority };
    if (data.assignedTo !== undefined && data.assignedTo !== task.assignedTo) changes.assignedTo = { from: task.assignedTo, to: data.assignedTo };

    // If member is assignee but not creator, they can ONLY update status
    if (userRole === 'MEMBER' && task.createdBy !== userId && task.assignedTo === userId) {
        const forbiddenChanges = Object.keys(changes).filter(k => k !== 'status');
        if (forbiddenChanges.length > 0) {
            throw new ForbiddenError(`As an assignee, you can only update the status. Fields restricted: ${forbiddenChanges.join(', ')}`);
        }
    }

    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
        include: {
            creator: { select: { id: true, name: true, email: true } },
            assignee: { select: { id: true, name: true, email: true } },
        },
    });

    // Log the update
    if (Object.keys(changes).length > 0) {
        await auditService.logAction({
            action: 'UPDATED',
            taskId: task.id,
            taskTitle: updatedTask.title,
            performedBy: userId,
            organizationId,
            changes,
        });
    }

    return updatedTask;
}

/**
 * Delete a task (admin: any task, member: own tasks)
 */
async function deleteTask({ taskId, organizationId, userId, userRole }) {
    const task = await prisma.task.findFirst({
        where: { id: taskId, organizationId },
    });

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    // Members can only delete their own tasks
    if (userRole === 'MEMBER' && task.createdBy !== userId) {
        throw new ForbiddenError('You can only delete tasks you created');
    }

    // Log the deletion before deleting
    await auditService.logAction({
        action: 'DELETED',
        taskId: task.id,
        taskTitle: task.title,
        performedBy: userId,
        organizationId,
        changes: { title: task.title, status: task.status, priority: task.priority },
    });

    await prisma.task.delete({ where: { id: taskId } });

    return { message: 'Task deleted successfully' };
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
