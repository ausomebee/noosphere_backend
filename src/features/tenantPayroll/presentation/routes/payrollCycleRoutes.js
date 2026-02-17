import express from "express";
import PayrollCycleController from "../controllers/payrollCycleController.js";
import PayrollCycleDto from "../dto/payrollCycleDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PayrollCycleCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *         - compensationType
 *         - interval
 *         - startDate
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the payroll cycle
 *           example: "Monthly Payroll"
 *         compensationType:
 *           type: string
 *           format: uuid
 *           description: ID of the associated compensation type
 *         interval:
 *           type: integer
 *           description: Payroll interval in days
 *           example: 30
 *         startDate:
 *           type: string
 *           description: Start date of the payroll cycle (YYYY-MM-DD)
 *           example: "2025-01-01"
 *         autoRun:
 *           type: boolean
 *           description: Whether the payroll cycle runs automatically
 *           example: false
 *
 *     PayrollCycleUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique payroll cycle ID
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         name:
 *           type: string
 *           description: Updated name of the payroll cycle
 *         compensationType:
 *           type: string
 *           format: uuid
 *           description: Updated compensation type reference
 *         interval:
 *           type: integer
 *           description: Updated interval in days
 *         startDate:
 *           type: string
 *           description: Updated start date (YYYY-MM-DD)
 *         autoRun:
 *           type: boolean
 *           description: Whether payroll auto-runs
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class PayrollCycleRoutes {
    constructor() {
        this.controller = new PayrollCycleController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/payroll-cycles/:
         *   post:
         *     summary: Create a payroll cycle
         *     tags: [payroll-cycles]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollCycleCreateDto'
         *     responses:
         *       201:
         *         description: Payroll cycle created successfully
         */
        this.router.post("/", PayrollCycleDto.createPayrollCycleDto, this.controller.createPayrollCycle);

        /**
         * @swagger
         * /api/v1/payroll-cycles/:
         *   put:
         *     summary: Update a payroll cycle
         *     tags: [payroll-cycles]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollCycleUpdateDto'
         *     responses:
         *       200:
         *         description: Payroll cycle updated successfully
         */
        this.router.put("/", PayrollCycleDto.updatePayrollCycleDto, this.controller.updatePayrollCycle);

        /**
         * @swagger
         * /api/v1/payroll-cycles/tenant/{tenantId}:
         *   get:
         *     summary: Get all payroll cycles for a tenant
         *     tags: [payroll-cycles]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of payroll cycles retrieved successfully
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantPayrollCycles);

        /**
         * @swagger
         * /api/v1/payroll-cycles/{id}:
         *   get:
         *     summary: Get a single payroll cycle by ID
         *     tags: [payroll-cycles]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payroll cycle retrieved successfully
         */
        this.router.get("/:id", this.controller.getSinglePayrollCycle);

        /**
         * @swagger
         * /api/v1/payroll-cycles/{id}/{active}:
         *   patch:
         *     summary: Activate or deactivate a payroll cycle
         *     tags: [payroll-cycles]
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
         *         description: Payroll cycle status updated successfully
         */
        this.router.patch("/:id/:active", this.controller.deactivatePayrollCycle);
    }

    getRouter() {
        return this.router;
    }
}

export default new PayrollCycleRoutes().getRouter();
