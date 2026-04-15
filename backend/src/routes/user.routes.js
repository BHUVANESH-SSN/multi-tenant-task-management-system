const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const userController = require('../controllers/user.controller');

const router = express.Router();

// All user routes require authentication and tenant isolation
router.use(authenticate, tenantIsolation);

// Get current user profile (any role)
router.get('/profile', userController.getProfile);

// Admin-only routes below
router.get('/', authorize('ADMIN'), userController.getUsers);

router.put(
    '/:id/role',
    authorize('ADMIN'),
    [body('role').isIn(['ADMIN', 'MEMBER']).withMessage('Role must be ADMIN or MEMBER')],
    validate,
    userController.updateUserRole
);

router.delete('/:id', authorize('ADMIN'), userController.removeUser);

module.exports = router;
