const userService = require('../services/user.service');

async function getUsers(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await userService.getUsers({
            organizationId: req.organizationId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function updateUserRole(req, res, next) {
    try {
        const result = await userService.updateUserRole({
            userId: req.params.id,
            organizationId: req.organizationId,
            role: req.body.role,
            requestingUserId: req.user.id,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function removeUser(req, res, next) {
    try {
        const result = await userService.removeUser({
            userId: req.params.id,
            organizationId: req.organizationId,
            requestingUserId: req.user.id,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function getProfile(req, res, next) {
    try {
        const result = await userService.getProfile(req.user.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { getUsers, updateUserRole, removeUser, getProfile };
