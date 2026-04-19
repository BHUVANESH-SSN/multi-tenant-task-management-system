const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const auditController = require('../controllers/audit.controller');

const router = express.Router();

// All audit routes require authentication and tenant isolation.
// Members can view audit logs for their organization as well.
router.use(authenticate, tenantIsolation, authorize('ADMIN', 'MEMBER'));

// Get all audit logs for the organization
router.get('/', auditController.getAuditLogs);

// Get audit logs for a specific task
router.get('/task/:taskId', auditController.getTaskAuditLogs);

module.exports = router;
