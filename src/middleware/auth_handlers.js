import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import prismaService from "../config/prisma.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

const prisma = prismaService.getClient();

function extractToken(req) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
        return auth.split(" ")[1];
    }
    return null;
}

export const adminProtect = (options = {}) =>
    asyncHandler(async (req, res, next) => {
        const token = extractToken(req);

        if (!token) {
            res.status(401);
            return next(new Error("Not Authorized: No token provided"));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch {
            res.status(401);
            return next(new Error("Not Authorized: Invalid or expired token"));
        }

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                superAdmin: true,
                active: true,
                isDeleted: true,
                roles: {
                    select: {
                        name: true,
                        dataAccessLevel: true,
                        systemModule: true,
                    },
                },
            },
        });

        if (!admin || admin.isDeleted || !admin.active) {
            res.status(401);
            return next(new Error("Not Authorized: Account not found or inactive"));
        }

        if (options.superAdmin && !admin.superAdmin) {
            res.status(403);
            return next(new Error("Forbidden: Super admin access required"));
        }

        req.user = { id: admin.id, type: "ADMIN", superAdmin: admin.superAdmin, role: admin.roles };
        req.admin = admin;
        next();
    });

const staffProtectMiddleware = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        res.status(401);
        return next(new Error("Not Authorized: No token provided"));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch {
        res.status(401);
        return next(new Error("Not Authorized: Invalid or expired token"));
    }

    const staff = await prisma.tenantStaff.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            tenantId: true,
            active: true,
            isDeleted: true,
            role: {
                select: {
                    name: true,
                    dataAccessLevel: true,
                    systemModule: true,
                },
            },
        },
    });

    if (!staff || staff.isDeleted || !staff.active) {
        res.status(401);
        return next(new Error("Not Authorized: Account not found or inactive"));
    }

    req.user = { id: staff.id, type: "STAFF", tenantId: staff.tenantId, role: staff.role };
    req.tenantStaff = staff;
    next();
});

export const staffProtect = (options = {}) => staffProtectMiddleware;

const clientProtectMiddleware = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        res.status(401);
        return next(new Error("Not Authorized: No token provided"));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch {
        res.status(401);
        return next(new Error("Not Authorized: Invalid or expired token"));
    }

    const clientTenant = await prisma.clientTenant.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            clientId: true,
            tenantId: true,
            active: true,
        },
    });

    if (!clientTenant || !clientTenant.active) {
        res.status(401);
        return next(new Error("Not Authorized: Account not found or inactive"));
    }

    req.user = { id: clientTenant.id, type: "CLIENT", clientId: clientTenant.clientId, tenantId: clientTenant.tenantId };
    req.clientTenant = clientTenant;
    next();
});

export const clientProtect = (options = {}) => clientProtectMiddleware;
