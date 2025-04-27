import expressAsyncHandler from "express-async-handler";
import AuthService from "../../application/authService.js";

class AuthController {
    constructor() {
        this.service = new AuthService();
    }

    generateAuthenticator = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.generateAuthenticator(req.params.id);

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
}

export default AuthController;