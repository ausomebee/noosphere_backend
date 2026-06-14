import express from "express";
import IncomeItemController from "../controllers/incomeItemController.js";
import IncomeItemDto from "../dto/incomeItemDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     IncomeItemCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *         - type
 *         - rate
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the income item
 *           example: "Basic Salary"
 *         type:
 *           type: string
 *           description: Type of the income item (e.g., fixed, variable)
 *           example: "fixed"
 *         rate:
 *           type: object
 *           description: Rate or value of the income item
 *           example: { amount: 50000, currency: "USD" }
 *
 *     IncomeItemUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique income item ID
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         name:
 *           type: string
 *           description: Updated name of the income item
 *         type:
 *           type: string
 *           description: Updated type of income item
 *         rate:
 *           type: object
 *           description: Updated rate
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class IncomeItemRoutes {
    constructor() {
        this.controller = new IncomeItemController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/income-items/:
         *   post:
         *     summary: Create an income item
         *     tags: [income-items]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/IncomeItemCreateDto'
         *     responses:
         *       201:
         *         description: Income item created successfully
         */
        this.router.post("/", staffProtect(), IncomeItemDto.createIncomeItemDto, this.controller.createIncomeItem);

        /**
         * @swagger
         * /api/v1/income-items/:
         *   put:
         *     summary: Update an income item
         *     tags: [income-items]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/IncomeItemUpdateDto'
         *     responses:
         *       200:
         *         description: Income item updated successfully
         */
        this.router.put("/", staffProtect(), IncomeItemDto.updateIncomeItemDto, this.controller.updateIncomeItem);

        /**
         * @swagger
         * /api/v1/income-items/tenant/{tenantId}:
         *   get:
         *     summary: Get all income items for a tenant
         *     tags: [income-items]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of income items retrieved successfully
         */
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantIncomeItems);

        /**
         * @swagger
         * /api/v1/income-items/{id}:
         *   get:
         *     summary: Get a single income item by ID
         *     tags: [income-items]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Income item retrieved successfully
         */
        this.router.get("/:id", staffProtect(), this.controller.getSingleIncomeItem);

        /**
         * @swagger
         * /api/v1/income-items/{id}/{active}:
         *   patch:
         *     summary: Activate or deactivate an income item
         *     tags: [income-items]
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
         *         description: Income item status updated successfully
         */
        this.router.patch("/:id/:active", staffProtect(), this.controller.deactivateIncomeItem);
    }

    getRouter() {
        return this.router;
    }
}

export default new IncomeItemRoutes().getRouter();
