const authService = require('../services/auth.service');

async function register(req, res, next) {
    try {
        const { email, password, name, organizationName, organizationSlug } = req.body;
        const result = await authService.register({ email, password, name, organizationName, organizationSlug });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function addMember(req, res, next) {
    try {
        const { email, password, name } = req.body;
        const result = await authService.addMember({
            email,
            password,
            name,
            organizationId: req.organizationId,
        });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

async function getMe(req, res, next) {
    try {
        res.json({ user: req.user });
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, refreshToken, addMember, getMe };
