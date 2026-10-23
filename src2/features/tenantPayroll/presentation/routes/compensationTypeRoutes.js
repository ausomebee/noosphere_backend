import express from "express";
import CompensationTypeController from "../controllers/compensationTypeController.js";
import CompensationTypeDto from "../dto/compensationTypeDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CompensationTypeCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the compensation type
 *           example: "Monthly Salary"
 *
 *     CompensationTypeUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique compensation type ID
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         name:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class CompensationTypeRoutes {
    constructor() {
        this.controller = new CompensationTypeController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/compensation-types/:
         *   post:
         *     summary: Create a compensation type
         *     tags: [compensation-types]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CompensationTypeCreateDto'
         *     responses:
         *       201:
         *         description: Compensation type created successfully
         */
        this.router.post("/", CompensationTypeDto.createCompensationTypeDto, this.controller.createCompensationType);

        /**
         * @swagger
         * /api/v1/compensation-types/:
         *   put:
         *     summary: Update a compensation type
         *     tags: [compensation-types]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CompensationTypeUpdateDto'
         *     responses:
         *       200:
         *         description: Compensation type updated successfully
         */
        this.router.put("/", CompensationTypeDto.updateCompensationTypeDto, this.controller.updateCompensationType);

        /**
         * @swagger
         * /api/v1/compensation-types/tenant/{tenantId}:
         *   get:
         *     summary: Get all compensation types for a tenant
         *     tags: [compensation-types]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of compensation types retrieved successfully
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantCompensationTypes);

        /**
         * @swagger
         * /api/v1/compensation-types/{id}:
         *   get:
         *     summary: Get a single compensation type by ID
         *     tags: [compensation-types]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Compensation type retrieved successfully
         */
        this.router.get("/:id", this.controller.getSingleCompensationType);

        /**
         * @swagger
         * /api/v1/compensation-types/{id}/{active}:
         *   patch:
         *     summary: Activate or deactivate a compensation type
         *     tags: [compensation-types]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Compensation type status updated successfully
         */
        this.router.patch("/:id/:active", this.controller.deactivateCompensationType);
    }

    getRouter() {
        return this.router;
    }
}

export default new CompensationTypeRoutes().getRouter();
