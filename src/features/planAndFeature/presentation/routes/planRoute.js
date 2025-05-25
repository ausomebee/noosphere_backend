import express from "express";
import PlanController from "../controllers/planController.js";
import PlanDto from "../dto/planDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityDto:
 *       type: object
 *       required:
 *         - id
 *         - active
 *         - administratorPassword
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID must be a valid UUID
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         active:
 *           type: boolean
 *           description: Indicates if the activity is active
 *           example: true
 *         administratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: administrator password
 *     DeletePlanDto:
 *       type: object
 *       required:
 *         - id
 *         - administratorPassword
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID must be a valid UUID
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         administratorPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 100
 *           example: "StrongP@ssw0rd!"
 *           description: administrator password
 *     CreateEnterpriseBillingPlanDto:
 *       type: object
 *       properties:
 *         planType:
 *           type: string
 *           example: "ENTERPRISE"
 *         name:
 *           type: string
 *           example: "Premium Plan"
 *         colourCode:
 *           type: string
 *           example: "#FF5733"
 *         description:
 *           type: string
 *           example: "Includes all advanced features and support"
 *         pricePerMonth:
 *           type: object
 *           required:
 *             - price
 *             - currency
 *           properties:
 *             price:
 *               type: number
 *               format: float
 *               example: 100
 *             currency:
 *               type: string
 *               example: "USD"
 *               description: "ISO 4217 currency code, e.g. USD, EUR"
 *         pricePerYear:
 *           type: object
 *           required:
 *             - price
 *             - currency
 *           properties:
 *             price:
 *               type: number
 *               format: float
 *               example: 100
 *             currency:
 *               type: string
 *               example: "USD"
 *               description: "ISO 4217 currency code, e.g. USD, EUR"
 *         forClient:
 *           type: integer
 *           example: 10
 *         forStaff:
 *           type: integer
 *           example: 50
 *         forStorage:
 *           type: number
 *           format: float
 *           example: 100.5
 *         extraFeaturesEnabled:
 *           type: boolean
 *           example: true
 *         tenantId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         adminId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "789e4567-e89b-12d3-a456-426614174999"
 *         features:
 *           type: object
 *           properties:
 *             connect:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *               example:
 *                 - id: "feature-id-1"
 *                 - id: "feature-id-2"
 *         extraFeatures:
 *           type: object
 *           properties:
 *             connect:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *               example:
 *                 - id: "extra-feature-id-1"
 *                 - id: "extra-feature-id-2"
 *         extraFeaturesWithPrice:
 *       type: object
 *       required:
 *         - id
 *         - pricePerMonth
 *         - pricePerYear
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *          pricePerMonth:
 *       type: object
 *       required:
 *         - price
 *         - currency
 *       properties:
 *         price:
 *           type: number
 *           example: 8
 *         currency:
 *           type: string
 *           enum: [USD]
 *           example: USD
 *          pricePerYear:
 *       type: object
 *       required:
 *         - price
 *         - currency
 *       properties:
 *         price:
 *           type: number
 *           example: 8
 *         currency:
 *           type: string
 *           enum: [USD]
 *           example: USD
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
         * /api/v1/plan/:
         *   post:
         *     summary: Create billing plan
         *     tags: [plan]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateEnterpriseBillingPlanDto'
         *     responses:
         *       201:
         *         description: billing plan created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", PlanDto.createBillingPlanDto, this.controller.createBillingPlan);

        /**
         * @swagger
         * /api/v1/plan/active:
         *   post:
         *     summary: update billing plan activity
         *     tags: [plan]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ActivityDto'
         *     responses:
         *       201:
         *         description: billing plan updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/active", PlanDto.activityDto, this.controller.updateBillingPlan);

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

        /**
        * @swagger
        * /api/v1/plan/type/{planType}:
        *   get:
        *     summary: gets billing plan by plan type
        *     tags: [plan]
        *     parameters:
        *       - in: path
        *         name: planType
        *         required: true
        *         schema:
        *           type: string
        *         description: The type of the billing plan
        *     responses:
        *       200:
        *         description: billing plan fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/type/:planType", PlanDto.planTypeDto, this.controller.getBillingPlanByType);

        /**
        * @swagger
        * /api/v1/plan/duplicate/{id}:
        *   get:
        *     summary: duplicate billing plan
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
        *         description: billing plan duplicated successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/duplicate/:id", PlanDto.checkIdDto, this.controller.duplicateBillingPlan);

        /**
         * @swagger
         * /api/v1/plan/:
         *   patch:
         *     summary: update billing plan
         *     tags: [plan]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateEnterpriseBillingPlanDto'
         *     responses:
         *       201:
         *         description: billing plan updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/", PlanDto.createBillingPlanDto, this.controller.updateBillingPlan);

        /**
         * @swagger
         * /api/v1/plan/:
         *   delete:
         *     summary: delete billing plan
         *     tags: [plan]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DeletePlanDto'
         *     responses:
         *       201:
         *         description: billing plan deleted successfully
         *       400:
         *         description: Validation error
         */
        this.router.delete("/", PlanDto.deletePlanDto, this.controller.deleteBillingPlan);

    }

    getRouter() {
        return this.router;
    }
}

export default new PlanRoutes().getRouter();