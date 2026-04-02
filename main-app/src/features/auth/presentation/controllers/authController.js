import expressAsyncHandler from "express-async-handler";
import AuthService from "../../application/authService.js";
import Auth from "../../domain/auth.js";

class AuthController {
    constructor() {
        this.service = new AuthService();
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
}

export default AuthController;