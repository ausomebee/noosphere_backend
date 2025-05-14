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
 *     updateStageOrder:
 *       type: object
 *       required:
 *         - id
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         order:
 *           type: number
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
 *         - assignToAdmin
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *         assignToAdmin:
 *           type: string
 *           format: uuid
 *
 *     CreateClientPipelineItem:
 *       type: object
 *       required:
 *         - clientId
 *         - pipelineStageId
 *         - assignToAdmin
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *         assignToAdmin:
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
 *     updateItemStage:
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
 *     updateStage:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - colourCode
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         colourCode:
 *           type: string
 *     updateTasks:
 *       type: object
 *       required:
 *         - tasks
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
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
 *     updateDocuments:
 *       type: object
 *       required:
 *         - documents
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
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
 *     assignCandidate:
 *       type: object
 *       required:
 *         - id
 *         - assignToAdmin
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         assignToAdmin:
 *           type: string
 *           format: uuid
 *     DeleteMultipleItemsDto:
 *       type: object
 *       required:
 *         - ids
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "123e4567-e89b-12d3-a456-426614174000"]
 *     UpdateItemDoneTasksDto:
 *       type: object
 *       required:
 *         - doneTasks
 *       properties:
 *         doneTasks:
 *           type: object
 *           description: Key-value object where keys are task names and values indicate completion (true/false)

 *     UpdateItemSentDocumentsDto:
 *       type: object
 *       required:
 *         - sentDocuments
 *       properties:
 *         sentDocuments:
 *           type: object
 *           description: Object representing documents that have been sent
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
         *     summary: Get pipeline by module
         *     tags: [Pipeline]
         *     parameters:
         *       - in: path
         *         name: module
         *         required: true
         *         schema:
         *           type: string
         *         description: The module to fetch pipeline for
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
         *     summary: Get pipeline by tenant ID
         *     tags: [Pipeline]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The tenant ID to fetch pipeline for
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
         *     summary: Get pipeline stage by pipeline ID
         *     tags: [PipelineStage]
         *     parameters:
         *       - in: path
         *         name: pipelineId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline
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
         *     summary: Get pipeline stage by ID
         *     tags: [PipelineStage]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline stage
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
         * /api/v1/pipeline/item/stage/tenant/{pipelineStageId}:
         *   get:
         *     summary: Get pipeline items (tenants) by stage ID
         *     tags: [PipelineItem]
         *     parameters:
         *       - in: path
         *         name: pipelineStageId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline stage
         *     responses:
         *       201:
         *         description: Pipeline items fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/item/stage/tenant/:pipelineStageId", PipelineDto.getItemByStageIdDto, this.controller.getItemByStageIdTenant);

        /**
         * @swagger
         * /api/v1/pipeline/item/stage/client/{pipelineStageId}:
         *   get:
         *     summary: Get pipeline items (clients) by stage ID 
         *     tags: [PipelineItem]
         *     parameters:
         *       - in: path
         *         name: pipelineStageId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline stage
         *     responses:
         *       201:
         *         description: Pipeline items fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/item/stage/client/:pipelineStageId", PipelineDto.getItemByStageIdDto, this.controller.getItemByStageIdClient);

        /**
         * @swagger
         * /api/v1/pipeline/item/{id}:
         *   get:
         *     summary: Get pipeline item by ID
         *     tags: [PipelineItem]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline item
         *     responses:
         *       201:
         *         description: Pipeline item fetched successfully
         *       400:
         *         description: Validation error
         */

        this.router.get("/item/:id", PipelineDto.getByIdDto, this.controller.getItemById);

        /**
         * @swagger
         * /api/v1/pipeline/item/stage:
         *   patch:
         *     summary: update activity
         *     tags: [PipelineItem]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/updateItemStage'
         *     responses:
         *       201:
         *         description: Pipeline item updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/item/stage", PipelineDto.updateItemStageDto, this.controller.updateItem);

       /**
         * @swagger
         * /api/v1/pipeline/stage/{id}:
         *   delete:
         *     summary: Delete pipeline stage
         *     tags: [PipelineStage]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline stage to delete
         *     responses:
         *       201:
         *         description: Pipeline stage deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/stage/:id", PipelineDto.getByIdDto, this.controller.deleteStage);

        /**
        * @swagger
        * /api/v1/pipeline/stage/order:
        *   patch:
        *     summary: update order
        *     tags: [PipelineStage]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/updateStageOrder'
        *     responses:
        *       201:
        *         description: Pipeline stage order updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/stage/order", PipelineDto.updateStageOrderDto, this.controller.updateStage);

        /**
        * @swagger
        * /api/v1/pipeline/stage:
        *   patch:
        *     summary: update stage data
        *     tags: [PipelineStage]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/updateStage'
        *     responses:
        *       201:
        *         description: Pipeline stage data updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/stage", PipelineDto.updateStageDto, this.controller.updateStage);

        /**
        * @swagger
        * /api/v1/pipeline/stage/task:
        *   patch:
        *     summary: update stage tasks
        *     tags: [PipelineStage]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/updateTasks'
        *     responses:
        *       201:
        *         description: Pipeline stage tasks updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/stage/task", PipelineDto.updateTasksDto, this.controller.updateStage);

        /**
        * @swagger
        * /api/v1/pipeline/stage/document:
        *   patch:
        *     summary: update stage documents
        *     tags: [PipelineStage]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/updateDocuments'
        *     responses:
        *       201:
        *         description: Pipeline stage documents updated successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/stage/document", PipelineDto.updateDocumentsDto, this.controller.updateStage);

        /**
        * @swagger
        * /api/v1/pipeline/item/assign:
        *   patch:
        *     summary: assign candidate to staff
        *     tags: [PipelineItem]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/assignCandidate'
        *     responses:
        *       201:
        *         description: Assigned candidate successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/item/assign", PipelineDto.assignCandidateDto, this.controller.updateItem);

        /**
         * @swagger
         * /api/v1/pipeline/tenant/item/{id}:
         *   delete:
         *     summary: Delete item
         *     tags: [PipelineItem]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the pipeline item to delete
         *     responses:
         *       201:
         *         description: Pipeline item deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/tenant/item/:id", PipelineDto.deleteTenantPipelineItemDto, this.controller.deleteTenantPipelineItem);

        /**
         * @swagger
         * /api/v1/pipeline/multi/tenant/item:
         *   delete:
         *     summary: Delete multiple tenant pipeline items
         *     tags:
         *       - Pipeline
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DeleteMultipleItemsDto'
         *     responses:
         *       200:
         *         description: Successfully deleted items
         *       400:
         *         description: Validation error
         */
        this.router.delete("/multi/tenant/item", PipelineDto.deleteMultipleItemsDto, this.controller.deleteMultipleTenantPipelineItems);

        /**
        * @swagger
        * /api/v1/pipeline/item/task:
        *   patch:
        *     summary: update task done
        *     tags: [PipelineItem]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/UpdateItemDoneTasksDto'
        *     responses:
        *       201:
        *         description: updated task successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/item/task", PipelineDto.updateItemDoneTasksDto, this.controller.updateItem);

        /**
        * @swagger
        * /api/v1/pipeline/item/document:
        *   patch:
        *     summary: update documents sent
        *     tags: [PipelineItem]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/UpdateItemSentDocumentsDto'
        *     responses:
        *       201:
        *         description: updated documents successfully
        *       400:
        *         description: Validation error
        */
        this.router.patch("/item/document", PipelineDto.updateItemSentDocumentsDto, this.controller.updateItem);

    }

    getRouter() {
        return this.router;
    }
}

export default new PipelineRoutes().getRouter();