import express from "express";
import PlanController from "../controllers/planController.js";
import PlanDto from "../dto/planDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBillingPlanDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - billingCycle
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: "active"
 *         description:
 *           type: string
 *           example: "active"
 *         billingCycle:
 *           type: string
 *           example: "active"
 *         price:
 *           type: number
 *           example: 19.99
 *           format: float
 *           description: Price of the product in the appropriate currency
 */

class PlanRoutes {
    constructor() {
        this.controller = new PlanController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        
        /**
         * @swagger
         * /api/v1/plan:
         *   post:
         *     summary: Create billing plan
         *     tags: [plan]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateBillingPlanDto'
         *     responses:
         *       201:
         *         description: billing plan created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", PlanDto.createBillingPlanDto, this.controller.createBillingPlan);

        /**
        * @swagger
        * /api/v1/plan/{id}:
        *   get:
        *     summary: gets single billing plan
        *     tags: [plan]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the billing plan
        *     responses:
        *       200:
        *         description: billing plan fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", PlanDto.checkIdDto, this.controller.getSingleBillingPlan);

        /**
         * @swagger
         * /api/v1/plan:
         *   get:
         *     summary: Retrieve all billing plan
         *     tags: [plan]
         *     responses:
         *       200:
         *         description: all billing plan retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/", this.controller.getAllBillingPlan);

    }

    getRouter() {
        return this.router;
    }
}

export default new PlanRoutes().getRouter();