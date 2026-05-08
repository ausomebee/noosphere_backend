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

    generateAuthenticator = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.generateAuthenticator(req.params);

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
        const auth = await this.service.verifyCode(req.body);

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: auth
        });
    });

    createSecreteMessage = expressAsyncHandler(async (req, res) => {
        const authData = new Auth(req.body);
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
        const authData = new Auth(req.body);
        const auth = await this.service.verifySecretMessage(authData.secretPayload);

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: auth
        });
    });

    generateTenantAuthenticator = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.generateTenantAuthenticator(req.params);

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
        const auth = await this.service.verifyStaffCode(req.body);

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: auth
        });
    });

    createStaffSecreteMessage = expressAsyncHandler(async (req, res) => {
        const authData = new Auth(req.body);
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
        const authData = new Auth(req.body);
        const auth = await this.service.verifyStaffSecretMessage(authData.secretPayload);

        if (!auth) {
            res.status(500).json({ message: 'Failed to verify auth' });
        }

        return res.status(201).json({
            message: "auth verified successfully",
            status: 'ok',
            data: auth
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

        if (ownerType === "ADMIN") {
            const admin = await this.prisma.admin.findUnique({
                where: { id: userId },
                include: { roles: true },
            });
            if (!admin || admin.isDeleted || !admin.active) {
                res.status(401);
                throw new Error("Account not found or inactive");
            }
            claims = { id: admin.id, role: admin.roles.name, permissions: admin.roles };
        } else if (ownerType === "STAFF") {
            const staff = await this.prisma.tenantStaff.findUnique({
                where: { id: userId },
                include: { role: true },
            });
            if (!staff || staff.isDeleted || !staff.active) {
                res.status(401);
                throw new Error("Account not found or inactive");
            }
            claims = { id: staff.id, role: staff.role.name, permissions: staff.role.access };
        } else if (ownerType === "CLIENT") {
            const clientTenant = await this.prisma.clientTenant.findUnique({
                where: { id: userId },
            });
            if (!clientTenant || !clientTenant.active) {
                res.status(401);
                throw new Error("Account not found or inactive");
            }
            claims = { id: clientTenant.id };
        } else {
            res.status(401);
            throw new Error("Invalid owner type");
        }

        const newAccessToken = TokenService.generateAccessToken(claims);
        const newRefreshToken = TokenService.generateRefreshToken(userId, ownerType);

        return res.status(200).json({
            message: "Token refreshed successfully",
            status: "ok",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    });
}

export default AuthController;