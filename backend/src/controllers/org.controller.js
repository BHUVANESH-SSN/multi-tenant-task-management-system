const { PrismaClient } = require('@prisma/client');
const { NotFoundError } = require('../utils/errors');
const prisma = new PrismaClient();

async function getOrganization(req, res, next) {
    try {
        const org = await prisma.organization.findUnique({
            where: { id: req.organizationId },
            select: { id: true, name: true, slug: true, createdAt: true },
        });
        if (!org) throw new NotFoundError('Organization not found');
        res.json({ organization: org });
    } catch (error) {
        next(error);
    }
}

async function updateOrganization(req, res, next) {
    try {
        const { name } = req.body;
        const org = await prisma.organization.update({
            where: { id: req.organizationId },
            data: { name },
            select: { id: true, name: true, slug: true, createdAt: true },
        });
        res.json({ organization: org });
    } catch (error) {
        next(error);
    }
}

module.exports = { getOrganization, updateOrganization };
