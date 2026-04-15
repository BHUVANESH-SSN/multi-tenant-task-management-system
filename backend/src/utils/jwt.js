const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate an access token
 */
function generateAccessToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/**
 * Generate a refresh token
 */
function generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
}

/**
 * Verify an access token
 */
function verifyAccessToken(token) {
    return jwt.verify(token, config.jwtSecret);
}

/**
 * Verify a refresh token
 */
function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwtRefreshSecret);
}

/**
 * Generate both access and refresh tokens for a user
 */
function generateTokenPair(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
    };
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken({ id: user.id }),
    };
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokenPair,
};
