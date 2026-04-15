const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const orgController = require('../controllers/org.controller');

const router = express.Router();

router.use(authenticate, tenantIsolation);

router.get('/', orgController.getOrganization);

router.put(
    '/',
    authorize('ADMIN'),
    [body('name').notEmpty().withMessage('Organization name is required')],
    validate,
    orgController.updateOrganization
);

module.exports = router;
