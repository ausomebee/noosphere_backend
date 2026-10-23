import express from "express";
import ProgramController from "../controllers/programController.js";
import ProgramDto from "../dto/programDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProgramDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - domainId
 *       properties:
 *         name:
 *           type: string
 *           example: "Customer Onboarding"
 *         description:
 *           type: string
 *           example: "A program to onboard new customers to our platform."
 *         domainId:
 *           type: string
 *           format: uuid
 *           example: "3d3f1a5d-8a2b-4d2a-bb4f-7dd6b0f9a123"
 *
 *     CreateCustomProgramDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - clientId
 *         - tenantId
 *       properties:
 *         name:
 *           type: string
 *           example: "Customer Onboarding"
 *         description:
 *           type: string
 *           example: "A program to onboard new customers to our platform."
 *         clientId:
 *           type: string
 *           format: uuid
 *           example: "3d3f1a5d-8a2b-4d2a-bb4f-7dd6b0f9a123"
 * 
 *     UpdateProgramDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "8b6b5a0e-6c9f-4a75-9e0b-7e6f2b9cc111"
 *         name:
 *           type: string
 *           example: "Customer Onboarding - v2"
 *         description:
 *           type: string
 *           example: "Updated description for the onboarding program."
 *         domainId:
 *           type: string
 *           format: uuid
 *           example: "3d3f1a5d-8a2b-4d2a-bb4f-7dd6b0f9a123"
 */

class ProgramRoutes {
    constructor() {
        this.controller = new ProgramController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/programs:
         *   post:
         *     summary: Create Program
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateProgramDto'
         *     responses:
         *       201:
         *         description: Program created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect(), ProgramDto.createProgramDto, this.controller.createProgram);

        /**
         * @swagger
         * /api/v1/programs/custom:
         *   post:
         *     summary: Create custom Program
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateCustomProgramDto'
         *     responses:
         *       201:
         *         description: Program created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/custom", staffProtect(), ProgramDto.createCustomProgramDto, this.controller.createCustomProgram);

        /**
         * @swagger
         * /api/v1/programs:
         *   patch:
         *     summary: Update Program
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateProgramDto'
         *     responses:
         *       201:
         *         description: Program updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/", staffProtect(), ProgramDto.updateProgramDto, this.controller.updateProgram);

        /**
        * @swagger
        * /api/v1/programs/{domainId}:
        *   get:
        *     summary: gets tenant programs
        *     tags: [program]
        *     parameters:
        *       - in: path
        *         name: domainId
        *         required: true
        *         schema:
        *           type: string
        *         description: The domain ID of the Program
        *     responses:
        *       200:
        *         description: Programs fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:domainId", staffProtect(), this.controller.getAllDomainPrograms);

         /**
        * @swagger
        * /api/v1/programs/tenant/{tenantId}:
        *   get:
        *     summary: gets tenant programs
        *     tags: [program]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The tenant ID of the Program
        *     responses:
        *       200:
        *         description: Programs fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getAllTenantPrograms);

        /**
         * @swagger
         * /api/v1/programs/{id}:
         *   delete:
         *     summary: Delete Program
         *     tags: [program]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The Program ID
         *     responses:
         *       200:
         *         description: Program deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/:id", staffProtect(), this.controller.deleteProgram);

    }

    getRouter() {
        return this.router;
    }
}

export default new ProgramRoutes().getRouter();