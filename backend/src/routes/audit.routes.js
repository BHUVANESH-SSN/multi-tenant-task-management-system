const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const auditController = require('../controllers/audit.controller');

const router = express.Router();

// All audit routes require authentication, tenant isolation, and admin role
router.use(authenticate, tenantIsolation, authorize('ADMIN'));

// Get all audit logs for the organization
router.get('/', auditController.getAuditLogs);

// Get audit logs for a specific task
router.get('/task/:taskId', auditController.getTaskAuditLogs);

module.exports = router;
