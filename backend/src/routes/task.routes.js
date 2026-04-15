const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const taskController = require('../controllers/task.controller');

const router = express.Router();

// All task routes require authentication and tenant isolation
router.use(authenticate, tenantIsolation);

// Create task
router.post(
    '/',
    [
        body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }),
        body('description').optional().isString(),
        body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
        body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
        body('assignedTo').optional().isUUID().withMessage('Invalid user ID'),
    ],
    validate,
    taskController.createTask
);

// Get all tasks (with query filters)
router.get('/', taskController.getTasks);

// Get single task
router.get('/:id', taskController.getTaskById);

// Update task
router.put(
    '/:id',
    [
        body('title').optional().notEmpty().isLength({ max: 255 }),
        body('description').optional().isString(),
        body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
        body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
        body('dueDate').optional({ nullable: true }).isISO8601(),
        body('assignedTo').optional({ nullable: true }).isUUID(),
    ],
    validate,
    taskController.updateTask
);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
