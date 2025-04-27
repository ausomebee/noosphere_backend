import express from "express";
import AuthController from "../controllers/authController.js";
import AuthDto from "../dto/authDto.js";

class AuthRoutes {
    constructor() {
        this.controller = new AuthController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
        * @swagger
        * /api/v1/auth/verify:
        *   post:
        *     summary: Verify 2FA token
        *     description: Verifies a user's 2FA token using their user ID and token.
        *     tags:
        *       - Auth
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             required:
        *               - userId
        *               - token
        *             properties:
        *               userId:
        *                 type: string
        *                 format: uuid
        *                 example: "123e4567-e89b-12d3-a456-426614174000"
        *                 description: UUID of the user
        *               token:
        *                 type: string
        *                 example: "123456"
        *                 description: 6-digit token from the authenticator app
        *     responses:
        *       200:
        *         description: Token verified successfully
        *       400:
        *         description: Invalid input
        *       401:
        *         description: Invalid or expired token
        */
        this.router.post("/verify", AuthDto.verifyDto, this.controller.verifyCode);

        /**
         * @swagger
         * /api/v1/auth/{id}:
         *   get:
         *     summary: get authenticator
         *     tags: [auth]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the user
         *     responses:
         *       200:
         *         description: auth created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/:id", AuthDto.authDto, this.controller.generateAuthenticator);

    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRoutes().getRouter();