import express from "express";
import TenantAdditionalSecurityQuestionsController from "../controllers/tenantAdditionalSecurityQuestionsController.js";
import TenantAdditionalSecurityQuestionsDto from "../dto/tenantAdditionalSecurityQuestionsDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantAdditionalSecurityQuestionCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - question
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "tenant-1234-uuid"
 *         question:
 *           type: string
 *           example: "What is your mother's maiden name?"
 *
 *     TenantAdditionalSecurityQuestionUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         question:
 *           type: string
 */

class TenantAdditionalSecurityQuestionsRoutes {
    constructor() {
        this.controller = new TenantAdditionalSecurityQuestionsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/tenant-security-questions:
         *   post:
         *     summary: Create a tenant security question
         *     tags: [tenant-security-question]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantAdditionalSecurityQuestionCreateDto'
         *     responses:
         *       201:
         *         description: Security question created successfully
         */
        this.router.post(
            "/",
            staffProtect(),
            TenantAdditionalSecurityQuestionsDto.createQuestionDto,
            this.controller.createQuestion
        );

        /**
         * @swagger
         * /api/v1/tenant-security-questions:
         *   put:
         *     summary: Update a tenant security question
         *     tags: [tenant-security-question]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantAdditionalSecurityQuestionUpdateDto'
         *     responses:
         *       200:
         *         description: Security question updated successfully
         */
        this.router.put(
            "/",
            staffProtect(),
            TenantAdditionalSecurityQuestionsDto.updateQuestionDto,
            this.controller.updateQuestion
        );

        /**
         * @swagger
         * /api/v1/tenant-security-questions/{id}:
         *   get:
         *     summary: Get a single tenant security question
         *     tags: [tenant-security-question]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Security question ID
         *     responses:
         *       200:
         *         description: Security question fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect(),
            this.controller.getQuestion
        );

        /**
         * @swagger
         * /api/v1/tenant-security-questions/tenant/{tenantId}:
         *   get:
         *     summary: Get all security questions for a tenant
         *     tags: [tenant-security-question]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: Tenant ID
         *     responses:
         *       200:
         *         description: Tenant security questions fetched successfully
         */
        this.router.get(
            "/tenant/:tenantId",
            staffProtect(),
            this.controller.getQuestions
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new TenantAdditionalSecurityQuestionsRoutes().getRouter();
