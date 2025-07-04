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
         * /api/v1/auth/{userId}/{module}:
         *   get:
         *     summary: get authenticator
         *     tags: [Auth]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the user
         *       - in: path
         *         name: module
         *         required: true
         *         schema:
         *           type: string
         *         description: The module of the user
         *     responses:
         *       200:
         *         description: auth created successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:userId/:module", AuthDto.authDto, this.controller.generateAuthenticator);

        /**
        * @swagger
        * /api/v1/auth/createsecretemessage:
        *   post:
        *     summary: create 2FA secret message
        *     description: creates a user's 2FA secret using their user ID and secret.
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
        *               - secret
        *               - module
        *             properties:
        *               userId:
        *                 type: string
        *                 format: uuid
        *                 example: "123e4567-e89b-12d3-a456-426614174000"
        *                 description: UUID of the user
        *               secret:
        *                 type: string
        *                 example: "malik"
        *                 description: answer to your secret message
        *               authQuestion:
        *                 type: string
        *                 example: "who are you"
        *                 description: your secret question
        *               module:
        *                 type: string
        *                 example: "ADMIN"
        *                 description: The module of the user
        *     responses:
        *       200:
        *         description: secret message created successfully
        *       400:
        *         description: Invalid input
        */
        this.router.post("/createsecretemessage", AuthDto.secretMessageDto, this.controller.createSecreteMessage);

        /**
        * @swagger
        * /api/v1/auth/verifysecretmessage:
        *   post:
        *     summary: verify 2FA secret message
        *     description: verifies a user's 2FA secret using their user ID and secret.
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
        *               - secret
        *             properties:
        *               userId:
        *                 type: string
        *                 format: uuid
        *                 example: "123e4567-e89b-12d3-a456-426614174000"
        *                 description: UUID of the user
        *               secret:
        *                 type: string
        *                 example: "malik"
        *                 description: answer to your secret message
        *     responses:
        *       200:
        *         description: secret message verified successfully
        *       400:
        *         description: Invalid input
        */
        this.router.post("/verifysecretmessage", AuthDto.verifySecretMessageDto, this.controller.verifySecretMessage);

        /**
        * @swagger
        * /api/v1/auth/tenant/verify:
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
        this.router.post("/tenant/verify", AuthDto.verifyDto, this.controller.verifyStaffCode);

        /**
         * @swagger
         * /api/v1/auth/tenant/{userId}/{module}:
         *   get:
         *     summary: get authenticator
         *     tags: [Auth]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the user
         *       - in: path
         *         name: module
         *         required: true
         *         schema:
         *           type: string
         *         description: The module of the user
         *     responses:
         *       200:
         *         description: auth created successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/tenant/:userId/:module", AuthDto.authDto, this.controller.generateTenantAuthenticator);

        /**
        * @swagger
        * /api/v1/auth/tenant/createsecretemessage:
        *   post:
        *     summary: create 2FA secret message
        *     description: creates a user's 2FA secret using their user ID and secret.
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
        *               - secret
        *               - module
        *             properties:
        *               userId:
        *                 type: string
        *                 format: uuid
        *                 example: "123e4567-e89b-12d3-a456-426614174000"
        *                 description: UUID of the user
        *               secret:
        *                 type: string
        *                 example: "malik"
        *                 description: answer to your secret message
        *               authQuestion:
        *                 type: string
        *                 example: "who are you"
        *                 description: your secret question
        *               module:
        *                 type: string
        *                 example: "ADMIN"
        *                 description: The module of the user
        *     responses:
        *       200:
        *         description: secret message created successfully
        *       400:
        *         description: Invalid input
        */
        this.router.post("/tenant/createsecretemessage", AuthDto.secretMessageDto, this.controller.createStaffSecreteMessage);

        /**
        * @swagger
        * /api/v1/auth/tenant/verifysecretmessage:
        *   post:
        *     summary: verify 2FA secret message
        *     description: verifies a user's 2FA secret using their user ID and secret.
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
        *               - secret
        *             properties:
        *               userId:
        *                 type: string
        *                 format: uuid
        *                 example: "123e4567-e89b-12d3-a456-426614174000"
        *                 description: UUID of the user
        *               secret:
        *                 type: string
        *                 example: "malik"
        *                 description: answer to your secret message
        *     responses:
        *       200:
        *         description: secret message verified successfully
        *       400:
        *         description: Invalid input
        */
        this.router.post("/tenant/verifysecretmessage", AuthDto.verifySecretMessageDto, this.controller.verifyStaffSecretMessage);

    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRoutes().getRouter();