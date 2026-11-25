import expressAsyncHandler from "express-async-handler";
import AuthService from "../../application/authService.js";
import RefreshTokenService from "../../application/refreshTokenService.js";
import Auth from "../../domain/auth.js";
import prismaService from "../../../../config/prisma.js";
import TokenService from "../../../../utilities/generate_token.js";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

class AuthController {
    constructor() {
        this.service = new AuthService();
        this.refreshTokenService = new RefreshTokenService();
        this.prisma = prismaService.getClient();
    }

    async issueVerifiedTokens(req) {
        const { id, ownerType } = req.twoFactor;
        let claims;
        let isSuperAdmin = false;
        if (ownerType === "ADMIN") {
            const admin = await this.prisma.admin.findUnique({ where: { id }, include: { roles: { include: { roleModuleAccesses: true } } } });
            if (!admin || !admin.active || admin.isDeleted) throw new Error("Account not found or inactive");
            isSuperAdmin = Boolean(admin.superAdmin);
            claims = { id, ownerType, role: admin.roles?.name, permissions: admin.roles, isSuperAdmin };
        } else {
            const staff = await this.prisma.tenantStaff.findUnique({ where: { id }, include: { role: { include: { roleModuleAccesses: true } }, tenant: true } });
            if (!staff || !staff.active || staff.isDeleted || !staff.tenant?.active || staff.tenant.isDeleted) throw new Error("Account not found or inactive");
            claims = { id, ownerType, role: staff.role.name, permissions: staff.role.roleModuleAccesses, isSuperAdmin: false };
        }
        return {
            accessToken: TokenService.generateAccessToken(claims),
            refreshToken: TokenService.generateRefreshToken(id, ownerType, { mfaVerified: true }),
            user: { id, ownerType, isSuperAdmin },
        };
    }

    generateAuthenticator = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.generateAuthenticator({ ...req.params, userId: req.twoFactor.id, module: "ADMIN" });

        if (!auth) {
            res.status(500).json({ message: 'Failed to create auth' });
        }

        return res.status(201).json({
            message: "auth created successfully",
            status: 'ok',
            data: auth
        });
    });

    verifyCode = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.verifyCode({ ...req.body, userId: req.twoFactor.id });

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: { verified: auth, ...await this.issueVerifiedTokens(req) }
        });
    });

    createSecreteMessage = expressAsyncHandler(async (req, res) => {
        const authData = new Auth({ ...req.body, userId: req.twoFactor.id, module: "ADMIN" });
        const auth = await this.service.createSecreteMessage(authData.secretPayload);

        if (!auth) {
            res.status(500).json({ message: 'Failed to create auth' });
        }

        return res.status(201).json({
            message: "auth created successfully",
            status: 'ok',
            data: auth
        });
    });

    verifySecretMessage = expressAsyncHandler(async (req, res) => {
        const authData = new Auth({ ...req.body, userId: req.twoFactor.id, module: "ADMIN" });
        const auth = await this.service.verifySecretMessage(authData.secretPayload);

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: { verified: auth, ...await this.issueVerifiedTokens(req) }
        });
    });

    generateTenantAuthenticator = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.generateTenantAuthenticator({ ...req.params, userId: req.twoFactor.id, module: "TENANT" });

        if (!auth) {
            res.status(500).json({ message: 'Failed to create auth' });
        }

        return res.status(201).json({
            message: "auth created successfully",
            status: 'ok',
            data: auth
        });
    });

    verifyStaffCode = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.verifyStaffCode({ ...req.body, userId: req.twoFactor.id });

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: { verified: auth, ...await this.issueVerifiedTokens(req) }
        });
    });

    createStaffSecreteMessage = expressAsyncHandler(async (req, res) => {
        const authData = new Auth({ ...req.body, userId: req.twoFactor.id, module: "TENANT" });
        const auth = await this.service.createStaffSecreteMessage(authData.secretPayload);

        if (!auth) {
            res.status(500).json({ message: 'Failed to create auth' });
        }

        return res.status(201).json({
            message: "auth created successfully",
            status: 'ok',
            data: auth
        });
    });

    verifyStaffSecretMessage = expressAsyncHandler(async (req, res) => {
        const authData = new Auth({ ...req.body, userId: req.twoFactor.id, module: "TENANT" });
        const auth = await this.service.verifyStaffSecretMessage(authData.secretPayload);

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: { verified: auth, ...await this.issueVerifiedTokens(req) }
        });
    });

    refreshToken = expressAsyncHandler(async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400);
            throw new Error("Refresh token is required");
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch {
            res.status(401);
            throw new Error("Invalid or expired refresh token");
        }

        const { id: userId, ownerType } = decoded;

        if (!userId || !ownerType) {
            res.status(401);
            throw new Error("Invalid refresh token payload");
        }

        let claims;
        let isSuperAdmin = false;
        let mfaRequired = false;

        if (ownerType === "ADMIN") {
            const admin = await this.prisma.admin.findUnique({
                where: { id: userId },
                include: { roles: true },
            });
            if (!admin || admin.isDeleted || !admin.active) {
                res.status(401);
                throw new Error("Account not found or inactive");
            }
            claims = { id: admin.id, ownerType, role: admin.roles.name, permissions: admin.roles };
            isSuperAdmin = Boolean(admin.superAdmin);
            const choices = await this.prisma.superAdminChoices.findFirst();
            mfaRequired = Boolean(choices?.isEnabled && (choices.setForAll || admin.authType));
        } else if (ownerType === "STAFF") {
            const staff = await this.prisma.tenantStaff.findUnique({
                where: { id: userId },
                include: { role: true, tenant: { include: { tenantAdminChoices: true } } },
            });
            if (!staff || staff.isDeleted || !staff.active) {
                res.status(401);
                throw new Error("Account not found or inactive");
            }
            claims = { id: staff.id, ownerType, role: staff.role.name, permissions: staff.role.access };
            const choices = staff.tenant?.tenantAdminChoices;
            mfaRequired = Boolean(choices?.isEnabled && (choices.setForAll || staff.authType));
        } else if (ownerType === "CLIENT") {
            const clientTenant = await this.prisma.clientTenant.findUnique({
                where: { id: userId },
            });
            if (!clientTenant || !clientTenant.active) {
                res.status(401);
                throw new Error("Account not found or inactive");
            }
            claims = { id: clientTenant.id, ownerType };
        } else {
            res.status(401);
            throw new Error("Invalid owner type");
        }

        if (mfaRequired && decoded.mfaVerified !== true) {
            res.status(401);
            throw new Error("Please complete two-factor verification before refreshing tokens");
        }

        claims.isSuperAdmin = isSuperAdmin;
        const newAccessToken = TokenService.generateAccessToken(claims);
        const newRefreshToken = TokenService.generateRefreshToken(userId, ownerType, { mfaVerified: decoded.mfaVerified === true });

        return res.status(200).json({
            message: "Token refreshed successfully",
            status: "ok",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: { id: userId, ownerType, isSuperAdmin },
            },
        });
    });
}

export default AuthController;
