import express from "express";
import { adminProtect } from "../../../../middleware/auth_handlers.js";
import PipelineDto from "../dto/pipelineDto.js";
import PipelineController from "../controllers/pipeline.Controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantPipelineDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           example: Sales Pipeline
 *           description: Name of the pipeline
 *         description:
 *           type: string
 *           example: Handles initial lead stages
 *           description: Optional pipeline description
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *           example: f06f4f54-d981-4588-a024-560f35b21f03
 *           description: Optional admin UUID who created the pipeline
 *       required:
 *         - name
 * 
 *     internalPipelineDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           example: Sales Pipeline
 *           description: Name of the pipeline
 *         description:
 *           type: string
 *           example: Handles initial lead stages
 *           description: Optional pipeline description
 *         createdByTenantId:
 *           type: string
 *           format: uuid
 *           example: f06f4f54-d981-4588-a024-560f35b21f03
 *           description: Optional tenant UUID who created the pipeline
 *       required:
 *         - name
 * 
 *     PipelineStageDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *           example: Initial Contact
 *           description: Name of the pipeline stage
 *         pipelineId:
 *           type: string
 *           format: uuid
 *           example: b3b7f7c2-1c54-4b09-9e64-a3db1c2b35d6
 *           description: Optional UUID of the related pipeline
 *         tasks:
 *           type: object
 *           example: { "callClient": true, "sendEmail": false }
 *           description: Optional object containing task-related data
 *         order:
 *           type: number
 *           example: 1
 *           description: Position/order of the stage within the pipeline
 *       required:
 *         - name
 *         - order
 * 
 * 
 *     PipelineItemDto:
 *       type: object
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *           example: "c2d7f8e9-8a5a-4f61-8c8a-1234567890ab"
 *           description: Optional client ID (UUID)
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "f3b8b12e-b93e-4d74-a729-abcdef123456"
 *           description: Optional tenant ID (UUID)
 *         PipelineStageId:
 *           type: string
 *           format: uuid
 *           example: "a7aeb1d7-3b98-4de2-b67d-87654f3210cd"
 *           description: Required pipeline stage ID (UUID)
 *         doneTasks:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             task1: true
 *             task2: false
 *           description: Optional object representing completed tasks
 *       required:
 *         - PipelineStageId
 */


class PipelineRoutes {
    constructor() {
        this.controller = new PipelineController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/pipeline/tenantpipeine:
         *   post:
         *     summary: create a new tenant pipeline
         *     tags: [pipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantPipelineDto'
         *     responses:
         *       201:
         *         description: pipeline created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/tenantpipeine", adminProtect, PipelineDto.tenantPipelineDto, this.controller.tenantPipeline);

        /**
         * @swagger
         * /api/v1/pipeline/internalpipeine:
         *   post:
         *     summary: create a new internal pipeline
         *     tags: [pipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/internalPipelineDto'
         *     responses:
         *       201:
         *         description: pipeline created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/internalpipeine", adminProtect, PipelineDto.internalPipelineDto, this.controller.internalPipeline);

        /**
         * @swagger
         * /api/v1/pipeline/pipelinestage:
         *   post:
         *     summary: create a new pipeline stage
         *     tags: [pipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PipelineStageDto'
         *     responses:
         *       201:
         *         description: pipeline stage created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/pipelinestage", adminProtect, PipelineDto.pipelineStageDto, this.controller.createPipelineStage);

        /**
        * @swagger
        * /api/v1/pipeline/pipelineItem:
        *   post:
        *     summary: create a new pipeline item
        *     tags: [pipeline]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/PipelineItemDto'
        *     responses:
        *       201:
        *         description: pipeline item created successfully
        *       400:
        *         description: Validation error
        */
        this.router.post("/pipelineItem", adminProtect, PipelineDto.pipelineItemDto, this.controller.createPipelineItem);

    }

    getRouter() {
        return this.router;
    }
}

export default new PipelineRoutes().getRouter();