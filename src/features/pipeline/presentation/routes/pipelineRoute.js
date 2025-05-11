import express from "express";
import { adminProtect } from "../../../../middleware/auth_handlers.js";
import PipelineDto from "../dto/pipelineDto.js";
import PipelineController from "../controllers/pipeline.Controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantPipeline:
 *       type: object
 *       required:
 *         - name
 *         - createdByAdminId
 *         - module
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *         description:
 *           type: string
 *         createdByAdminId:
 *           type: string
 *           format: uuid
 *         module:
 *           type: string
 *
 *     ClientPipeline:
 *       type: object
 *       required:
 *         - name
 *         - createdByTenantId
 *         - module
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *         description:
 *           type: string
 *         createdByTenantId:
 *           type: string
 *           format: uuid
 *         module:
 *           type: string
 *
 *     GetPipelinesByTenantIdParams:
 *       type: object
 *       required:
 *         - tenantId
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *
 *     GetPipelinesByModuleParams:
 *       type: object
 *       required:
 *         - module
 *       properties:
 *         module:
 *           type: string
 *
 *     UpdateActivity:
 *       type: object
 *       required:
 *         - id
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         isActive:
 *           type: boolean
 *
 *     CreateStage:
 *       type: object
 *       required:
 *         - name
 *         - pipelineId
 *         - colourCode
 *         - tasks
 *         - documents
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 20
 *         description:
 *           type: string
 *         pipelineId:
 *           type: string
 *           format: uuid
 *         colourCode:
 *           type: string
 *         tasks:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - required
 *             properties:
 *               name:
 *                 type: string
 *               required:
 *                 type: boolean
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - required
 *             properties:
 *               name:
 *                 type: string
 *               required:
 *                 type: boolean
 *
 *     GetStagesByPipelineIdParams:
 *       type: object
 *       required:
 *         - pipelineId
 *       properties:
 *         pipelineId:
 *           type: string
 *           format: uuid
 *
 *     GetByIdParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *
 *     CreateTenantPipelineItem:
 *       type: object
 *       required:
 *         - tenantId
 *         - pipelineStageId
 *         - assignToStaff
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *         assignToStaff:
 *           type: string
 *           format: uuid
 *
 *     CreateClientPipelineItem:
 *       type: object
 *       required:
 *         - clientId
 *         - pipelineStageId
 *         - assignToStaff
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *         assignToStaff:
 *           type: string
 *           format: uuid
 *
 *     GetItemByStageIdParams:
 *       type: object
 *       required:
 *         - pipelineStageId
 *       properties:
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *
 *     UpdateStage:
 *       type: object
 *       required:
 *         - id
 *         - pipelineStageId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         pipelineStageId:
 *           type: string
 *           format: uuid
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
         * /api/v1/pipeline/tenants:
         *   post:
         *     summary: Create a new pipeline for a tenant
         *     tags: [TenantPipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantPipeline'
         *     responses:
         *       201:
         *         description: Pipeline created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/tenants", PipelineDto.tenantPipelineDto, this.controller.createPipeline);

        /**
         * @swagger
         * /api/v1/pipeline/clients:
         *   post:
         *     summary: Create a new pipeline for a client
         *     tags: [ClientPipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientPipeline'
         *     responses:
         *       201:
         *         description: Pipeline created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/clients", PipelineDto.clientPipelineDto, this.controller.createPipeline);

        /**
         * @swagger
         * /api/v1/pipeline/module/{module}:
         *   get:
         *     summary: get pipeline by module
         *     tags: [Pipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/GetPipelinesByModuleParams'
         *     responses:
         *       201:
         *         description: Pipeline fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/module/:module", PipelineDto.getPipelinesByModuleDto, this.controller.getPipelinesByModule);

        /**
         * @swagger
         * /api/v1/pipeline/tenant/{tenantId}:
         *   get:
         *     summary: get pipeline by tenant id
         *     tags: [Pipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/GetPipelinesByTenantIdParams'
         *     responses:
         *       201:
         *         description: Pipeline fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/tenant/:tenantId", PipelineDto.getPipelinesByTenantIdDto, this.controller.getPipelinesByTenantId);

        /**
         * @swagger
         * /api/v1/pipeline/active:
         *   patch:
         *     summary: update activity
         *     tags: [Pipeline]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateActivity'
         *     responses:
         *       201:
         *         description: Pipeline updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/active", PipelineDto.updateActivityDto, this.controller.updatePipeline);

        /**
         * @swagger
         * /api/v1/pipeline/stage:
         *   post:
         *     summary: Create a new pipeline stage 
         *     tags: [PipelineStage]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateStage'
         *     responses:
         *       201:
         *         description: Pipeline stage created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/stage", PipelineDto.createStageDto, this.controller.createPipelineStage);

        /**
         * @swagger
         * /api/v1/pipeline/stage/pipeline/{pipelineId}:
         *   get:
         *     summary: get pipeline stage by pipeline id
         *     tags: [PipelineStage]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/GetStagesByPipelineIdParams'
         *     responses:
         *       201:
         *         description: Pipeline stage fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/stage/pipeline/:pipelineId", PipelineDto.getStagesByPipelineIdDto, this.controller.getStageByPipelineId);

        /**
         * @swagger
         * /api/v1/pipeline/stage/{id}:
         *   get:
         *     summary: get pipeline stage by id
         *     tags: [PipelineStage]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/GetByIdParams'
         *     responses:
         *       201:
         *         description: Pipeline stage fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/stage/:id", PipelineDto.getByIdDto, this.controller.getStageById);

        /**
         * @swagger
         * /api/v1/pipeline/stage/active:
         *   patch:
         *     summary: update activity
         *     tags: [PipelineStage]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateActivity'
         *     responses:
         *       201:
         *         description: Pipeline stage updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/stage/active", PipelineDto.updateActivityDto, this.controller.updateStage);

        /**
         * @swagger
         * /api/v1/pipeline/client/pipelineitem:
         *   post:
         *     summary: Create a new pipeline item for client 
         *     tags: [PipelineItem]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateClientPipelineItem'
         *     responses:
         *       201:
         *         description: Pipeline item created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/client/pipelineitem", PipelineDto.createClientPipelineItemDto, this.controller.createPipelineItem);

        /**
         * @swagger
         * /api/v1/pipeline/tenant/pipelineitem:
         *   post:
         *     summary: Create a new pipeline item for tenant 
         *     tags: [PipelineItem]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateTenantPipelineItem'
         *     responses:
         *       201:
         *         description: Pipeline item created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/tenant/pipelineitem", PipelineDto.createTenantPipelineItemDto, this.controller.createPipelineItem);

        /**
         * @swagger
         * /api/v1/pipeline/item/stage/{pipelineStageId}:
         *   get:
         *     summary: get pipeline item by stage id
         *     tags: [PipelineItem]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/GetItemByStageIdParams'
         *     responses:
         *       201:
         *         description: Pipeline items fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/item/stage/:pipelineStageId", PipelineDto.getItemByStageIdDto, this.controller.getItemByStageId);

        /**
         * @swagger
         * /api/v1/pipeline/item/{id}:
         *   get:
         *     summary: get pipeline item by id
         *     tags: [PipelineItem]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/GetByIdParams'
         *     responses:
         *       201:
         *         description: Pipeline item fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/item/:id", PipelineDto.getByIdDto, this.controller.getItemById);

        /**
         * @swagger
         * /api/v1/item/stage:
         *   patch:
         *     summary: update activity
         *     tags: [PipelineItem]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateActivity'
         *     responses:
         *       201:
         *         description: Pipeline item updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/item/stage", PipelineDto.updateStageDto, this.controller.updateItem);

    }

    getRouter() {
        return this.router;
    }
}

export default new PipelineRoutes().getRouter();