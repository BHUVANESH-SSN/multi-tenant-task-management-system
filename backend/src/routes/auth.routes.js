const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const authController = require('../controllers/auth.controller');
const config = require('../config');

const router = express.Router();

// --- Public routes ---

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').notEmpty().withMessage('Name is required'),
        body('organizationName').notEmpty().withMessage('Organization name is required'),
        body('organizationSlug')
            .matches(/^[a-z0-9-]+$/)
            .withMessage('Slug must be lowercase alphanumeric with hyphens only')
            .isLength({ min: 3 })
            .withMessage('Slug must be at least 3 characters'),
    ],
    validate,
    authController.register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    authController.login
);

router.post(
    '/refresh',
    [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
    validate,
    authController.refreshToken
);

// --- Protected routes ---

router.get('/me', authenticate, authController.getMe);

router.post(
    '/members',
    authenticate,
    tenantIsolation,
    authorize('ADMIN'),
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').notEmpty().withMessage('Name is required'),
    ],
    validate,
    authController.addMember
);

// --- Google OAuth routes ---

// Only set up Google OAuth if credentials are provided
if (config.google.clientId && config.google.clientSecret) {
    const passport = require('passport');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    const authService = require('../services/auth.service');

    passport.use(
        new GoogleStrategy(
            {
                clientID: config.google.clientId,
                clientSecret: config.google.clientSecret,
                callbackURL: config.google.callbackUrl,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const result = await authService.googleAuth({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                    });
                    done(null, result);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    router.get(
        '/google',
        passport.authenticate('google', { scope: ['profile', 'email'], session: false })
    );

    router.get(
        '/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: `${config.frontendUrl}/login?error=oauth_failed` }),
        (req, res) => {
            const { accessToken, refreshToken } = req.user;
            res.redirect(
                `${config.frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
            );
        }
    );
}

// --- GitHub OAuth routes ---

if (config.github.clientId && config.github.clientSecret) {
    const passport = require('passport');
    const GitHubStrategy = require('passport-github2').Strategy;
    const authService = require('../services/auth.service');

    passport.use(
        new GitHubStrategy(
            {
                clientID: config.github.clientId,
                clientSecret: config.github.clientSecret,
                callbackURL: config.github.callbackUrl,
                scope: ['user:email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;
                    const result = await authService.githubAuth({
                        githubId: profile.id,
                        email,
                        name: profile.displayName || profile.username,
                    });
                    done(null, result);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    router.get(
        '/github',
        passport.authenticate('github', { scope: ['user:email'], session: false })
    );

    router.get(
        '/github/callback',
        passport.authenticate('github', { session: false, failureRedirect: `${config.frontendUrl}/login?error=oauth_failed` }),
        (req, res) => {
            const { accessToken, refreshToken } = req.user;
            res.redirect(
                `${config.frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
            );
        }
    );
}

module.exports = router;
