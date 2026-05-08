import express from "express";
import { adminProtect } from "../../../../middleware/auth_handlers.js";
import PipelineDto from "../dto/pipelineDto.js";
import PipelineController from "../controllers/pipeline.Controller.js";
import S3Service from "../../../../utilities/s3.js";

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
 *         requiredTasks:
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
 *         requiredDocuments:
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
 *     MoveMultipleItemsDto:
 *       type: object
 *       required:
 *         - ids
 *         - pipelineStageId
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "123e4567-e89b-12d3-a456-426614174000"]
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *     AssignMultipleItemsDto:
 *       type: object
 *       required:
 *         - ids
 *         - assignToAdmin
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "123e4567-e89b-12d3-a456-426614174000"]
 *         assignToAdmin:
 *           type: string
 *           format: uuid
 *     UpdateItemDoneTasksDto:
*       type: object
*       required:
*         - id
*         - doneTasks
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: UUID of the pipeline item
*           example: "d3b07384-d9a7-4c9d-aafd-3d1f7c4e9a2a"
*         doneTasks:
*           type: object
*           description: Key-value object where keys are task names and values indicate completion (true/false)
*           example:
*               "design": true,
*               "development": false,
*               "testing": true

*     UpdateItemSentDocumentsDto:
*       type: object
*       required:
*         - id
*         - sentDocuments
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: UUID of the pipeline item
*           example: "4f1b2aa3-98a2-4ff1-a6b5-0b4f33b3a1cd"
*         sentDocuments:
*           type: object
*           description: Object representing documents that have been sent
*           example:
*             
*               "invoice": true,
*               "contract": true,
*               "NDA": false
*             
*/

class PipelineRoutes {
    constructor() {
        this.controller = new PipelineController();
        this.router = express.Router();
        this.S3Service = new S3Service().getUploadMiddleware()
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
         * /api/v1/pipeline/item/client/{id}:
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

        this.router.get("/item/client/:id", PipelineDto.getByIdDto, this.controller.getItemByIdClient);

         /**
         * @swagger
         * /api/v1/pipeline/overview/{tenantId}:
         *   get:
         *     summary: Get pipeline overview
         *     tags: [Pipeline]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant
         *     responses:
         *       201:
         *         description: Pipeline overview fetched successfully
         *       400:
         *         description: Validation error
         */

        this.router.get("/overview/:tenantId", this.controller.getTenantPipelineSummary);

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
         * /api/v1/pipeline/client/item/{id}:
         *   delete:
         *     summary: Delete client pipeline item
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
        this.router.delete("/client/item/:id", PipelineDto.deleteTenantPipelineItemDto, this.controller.deleteClientPipelineItem);

        /**
         * @swagger
         * /api/v1/pipeline/client/item/{id}:
         *   delete:
         *     summary: move to client
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
         *         description: Pipeline item noved to client successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/client/item/:id", PipelineDto.deleteTenantPipelineItemDto, this.controller.moveToClient);

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
         * /api/v1/pipeline/multi/move/tenant/item:
         *   patch:
         *     summary: Move multiple tenant pipeline items
         *     tags:
         *       - Pipeline
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/MoveMultipleItemsDto'
         *     responses:
         *       200:
         *         description: Successfully moved items
         *       400:
         *         description: Validation error
         */
        this.router.patch("/multi/move/tenant/item", PipelineDto.moveMultipleItemsDto, this.controller.moveMultipleTenantPipelineItems);

        /**
         * @swagger
         * /api/v1/pipeline/multi/assign/tenant/item:
         *   patch:
         *     summary: Assign multiple tenant pipeline items
         *     tags:
         *       - Pipeline
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AssignMultipleItemsDto'
         *     responses:
         *       200:
         *         description: Successfully assigned items
         *       400:
         *         description: Validation error
         */
        this.router.patch("/multi/assign/tenant/item", PipelineDto.assignMultipleItemsDto, this.controller.assignMultipleTenantPipelineItems);

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

        /**
         * @swagger
         * /api/v1/pipeline/item/document/{id}:
         *   post:
         *     summary: Upload documents and update item
         *     tags:
         *       - PipelineItem
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID of the item to update
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               documents:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Multiple documents to upload
         *     responses:
         *       201:
         *         description: Item updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                 status:
         *                   type: string
         *                 data:
         *                   type: object
         *       500:
         *         description: Failed to update item
         */
        this.router.post("/item/document/:id", this.S3Service.any(), this.controller.updateItemSentDocuments);

        // ── Custom task routes ─────────────────────────────────────────────────

        /**
         * @swagger
         * /api/v1/pipeline/item/custom/task:
         *   post:
         *     summary: Create a custom task for a pipeline item
         *     tags: [PipelineItemCustomTask]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - pipelineItemId
         *               - taskName
         *             properties:
         *               pipelineItemId:
         *                 type: string
         *                 format: uuid
         *               taskName:
         *                 type: string
         *               isRequired:
         *                 type: boolean
         *     responses:
         *       201:
         *         description: Custom task created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/item/custom/task", PipelineDto.createCustomTaskDto, this.controller.createCustomTask);

        /**
         * @swagger
         * /api/v1/pipeline/item/{pipelineItemId}/custom/tasks:
         *   get:
         *     summary: Get all custom tasks for a pipeline item
         *     tags: [PipelineItemCustomTask]
         *     parameters:
         *       - in: path
         *         name: pipelineItemId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Custom tasks fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/item/:pipelineItemId/custom/tasks", PipelineDto.getCustomByItemIdDto, this.controller.getCustomTasksByItemId);

        /**
         * @swagger
         * /api/v1/pipeline/item/custom/task:
         *   patch:
         *     summary: Update a custom task
         *     tags: [PipelineItemCustomTask]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - id
         *             properties:
         *               id:
         *                 type: string
         *                 format: uuid
         *               taskName:
         *                 type: string
         *               isRequired:
         *                 type: boolean
         *               isCompleted:
         *                 type: boolean
         *     responses:
         *       200:
         *         description: Custom task updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/item/custom/task", PipelineDto.updateCustomTaskDto, this.controller.updateCustomTask);

        /**
         * @swagger
         * /api/v1/pipeline/item/custom/task/{id}:
         *   delete:
         *     summary: Delete a custom task
         *     tags: [PipelineItemCustomTask]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Custom task deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/item/custom/task/:id", PipelineDto.getByIdDto, this.controller.deleteCustomTask);

        // ── Custom document routes ─────────────────────────────────────────────

        /**
         * @swagger
         * /api/v1/pipeline/item/custom/document:
         *   post:
         *     summary: Create a custom document requirement for a pipeline item
         *     tags: [PipelineItemCustomDocument]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - pipelineItemId
         *               - documentName
         *             properties:
         *               pipelineItemId:
         *                 type: string
         *                 format: uuid
         *               documentName:
         *                 type: string
         *               isRequired:
         *                 type: boolean
         *               description:
         *                 type: string
         *     responses:
         *       201:
         *         description: Custom document created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/item/custom/document", PipelineDto.createCustomDocumentDto, this.controller.createCustomDocument);

        /**
         * @swagger
         * /api/v1/pipeline/item/{pipelineItemId}/custom/documents:
         *   get:
         *     summary: Get all custom documents for a pipeline item
         *     tags: [PipelineItemCustomDocument]
         *     parameters:
         *       - in: path
         *         name: pipelineItemId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Custom documents fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/item/:pipelineItemId/custom/documents", PipelineDto.getCustomByItemIdDto, this.controller.getCustomDocumentsByItemId);

        /**
         * @swagger
         * /api/v1/pipeline/item/custom/document:
         *   patch:
         *     summary: Update a custom document requirement
         *     tags: [PipelineItemCustomDocument]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - id
         *             properties:
         *               id:
         *                 type: string
         *                 format: uuid
         *               documentName:
         *                 type: string
         *               isRequired:
         *                 type: boolean
         *               description:
         *                 type: string
         *               fileUrl:
         *                 type: string
         *               isVerified:
         *                 type: boolean
         *     responses:
         *       200:
         *         description: Custom document updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/item/custom/document", PipelineDto.updateCustomDocumentDto, this.controller.updateCustomDocument);

        /**
         * @swagger
         * /api/v1/pipeline/item/custom/document/{id}:
         *   delete:
         *     summary: Delete a custom document requirement
         *     tags: [PipelineItemCustomDocument]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Custom document deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/item/custom/document/:id", PipelineDto.getByIdDto, this.controller.deleteCustomDocument);

    }

    getRouter() {
        return this.router;
    }
}

export default new PipelineRoutes().getRouter();