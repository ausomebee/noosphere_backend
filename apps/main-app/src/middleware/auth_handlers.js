import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import prismaService from "../config/prisma.js";
import { hasPermission } from "./permission_handlers.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

const prisma = prismaService.getClient();

function extractToken(req) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
        return auth.split(" ")[1];
    }
    return null;
}

function rejectTwoFactorToken(decoded, res, next) {
    if (decoded.tokenUse === "two_factor") {
        res.status(403);
        next(new Error("Forbidden: Complete two-factor verification first"));
        return true;
    }
    return false;
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
        if (rejectTwoFactorToken(decoded, res, next)) return;

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                superAdmin: true,
                active: true,
                isDeleted: true,
                roles: {
                    select: {
                            id: true,
                        name: true,
                        dataAccessLevel: true,
                        systemModule: true,
                            roleModuleAccesses: { select: { permissions: true } },
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

        const permissions = admin.roles?.roleModuleAccesses?.flatMap((access) =>
            access.permissions.map((entry) => typeof entry === "string" ? entry : entry?.key).filter(Boolean)
        ) ?? [];
        if (options.permission && !hasPermission({ type: "ADMIN", superAdmin: admin.superAdmin, permissions }, options.permission)) {
            res.status(403);
            return next(new Error("Forbidden: Required permission is missing"));
        }

        req.user = {
            id: admin.id,
            name: `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
            type: "ADMIN",
            superAdmin: admin.superAdmin,
            role: admin.roles,
            permissions,
        };
        req.admin = admin;
        next();
    });

const staffProtectMiddleware = (options = {}) => asyncHandler(async (req, res, next) => {
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
    if (rejectTwoFactorToken(decoded, res, next)) return;

    const staff = await prisma.tenantStaff.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            fullName: true,
            tenantId: true,
            active: true,
            isDeleted: true,
            role: {
                select: {
                    id: true,
                    name: true,
                    dataAccessLevel: true,
                    systemModule: true,
                    roleModuleAccesses: { select: { permissions: true } },
                },
            },
            tenant: {
                select: {
                    active: true,
                    isDeleted: true,
                    featuresDisabled: true,
                    suspensionReason: true,
                },
            },
        },
    });

    if (!staff || staff.isDeleted || !staff.active) {
        res.status(401);
        return next(new Error("Not Authorized: Account not found or inactive"));
    }

    if (!staff.tenant || staff.tenant.isDeleted || !staff.tenant.active) {
        res.status(401);
        return next(new Error(staff.tenant?.suspensionReason || "Not Authorized: Tenant account is not active"));
    }

    if (staff.tenant.featuresDisabled) {
        res.status(403);
        return next(new Error(staff.tenant.suspensionReason || "Access to this feature has been suspended"));
    }

    const permissions = staff.role?.roleModuleAccesses?.flatMap((access) =>
        access.permissions.map((entry) => typeof entry === "string" ? entry : entry?.key).filter(Boolean)
    ) ?? [];

    req.user = {
        id: staff.id,
        name: staff.fullName,
        type: "STAFF",
        tenantId: staff.tenantId,
        role: staff.role,
        permissions,
    };
    req.tenantStaff = staff;
    if (options.permission && !hasPermission(req.user, options.permission)) {
        res.status(403);
        return next(new Error("Forbidden: Required permission is missing"));
    }
    next();
});

export const staffProtect = (options = {}) => staffProtectMiddleware(options);

const clientProtectMiddleware = (options = {}) => asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        if (options.optional) return next();
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
    if (rejectTwoFactorToken(decoded, res, next)) return;

    if (!decoded.id) {
        res.status(401);
        return next(new Error("Not Authorized: Invalid token payload"));
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

    if (decoded.ownerType && decoded.ownerType !== "CLIENT") {
        res.status(403);
        return next(new Error("Forbidden: Client access required"));
    }

    req.user = { id: clientTenant.id, type: "CLIENT", clientId: clientTenant.clientId, tenantId: clientTenant.tenantId };
    req.clientTenant = clientTenant;
    next();
});

export const clientProtect = (options = {}) => clientProtectMiddleware(options);

export const twoFactorProtect = (ownerType) => asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        res.status(401);
        return next(new Error("Not Authorized: No two-factor token provided"));
    }
    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch {
        res.status(401);
        return next(new Error("Not Authorized: Invalid or expired two-factor token"));
    }
    if (decoded.tokenUse && decoded.tokenUse !== "two_factor") {
        res.status(403);
        return next(new Error("Forbidden: A valid two-factor or access token is required"));
    }
    if (!decoded.id || (ownerType && decoded.ownerType && decoded.ownerType !== ownerType)) {
        res.status(403);
        return next(new Error("Forbidden: A valid two-factor or access token is required"));
    }
    req.twoFactor = { id: decoded.id, ownerType: decoded.ownerType || ownerType };
    next();
});
