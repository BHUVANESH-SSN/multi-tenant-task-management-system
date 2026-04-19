const taskService = require('../services/task.service');
const normalizeEnum = (value) => (typeof value === 'string' ? value.trim().toUpperCase() : value);

async function createTask(req, res, next) {
    try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        const task = await taskService.createTask({
            title,
            description,
            status: normalizeEnum(status),
            priority: normalizeEnum(priority),
            dueDate,
            assignedTo,
            organizationId: req.organizationId,
            userId: req.user.id,
        });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}

async function getTasks(req, res, next) {
    try {
        const { status, priority, assignedTo, createdBy, page, limit } = req.query;
        const result = await taskService.getTasks({
            organizationId: req.organizationId,
            status: normalizeEnum(status),
            priority: normalizeEnum(priority),
            assignedTo,
            createdBy,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function getTaskById(req, res, next) {
    try {
        const task = await taskService.getTaskById({
            taskId: req.params.id,
            organizationId: req.organizationId,
        });
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function updateTask(req, res, next) {
    try {
        const task = await taskService.updateTask({
            taskId: req.params.id,
            organizationId: req.organizationId,
            userId: req.user.id,
            userRole: req.user.role,
            data: {
                ...req.body,
                status: normalizeEnum(req.body.status),
                priority: normalizeEnum(req.body.priority),
            },
        });
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function deleteTask(req, res, next) {
    try {
        const result = await taskService.deleteTask({
            taskId: req.params.id,
            organizationId: req.organizationId,
            userId: req.user.id,
            userRole: req.user.role,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
