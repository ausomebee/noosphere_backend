import express from "express";
import PayrollRecordController from "../controllers/payrollRecordController.js";
import PayrollRecordDto from "../dto/payrollRecordDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PayrollRecordCreateDto:
 *       type: object
 *       required:
 *         - payrollCycleId
 *         - from
 *         - to
 *         - noOfStaff
 *         - totalValue
 *       properties:
 *         payrollCycleId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the payroll cycle
 *         from:
 *           type: string
 *           format: date
 *           description: Start date of the payroll period
 *         to:
 *           type: string
 *           format: date
 *           description: End date of the payroll period
 *         noOfStaff:
 *           type: integer
 *           description: Number of staff included in this payroll
 *           example: 12
 *         totalValue:
 *           type: number
 *           format: float
 *           description: Total payroll amount for the cycle
 *           example: 500000.00
 *
 *     PayrollRecordUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique payroll record ID
 *         payrollCycleId:
 *           type: string
 *           format: uuid
 *           description: Payroll cycle identifier
 *         from:
 *           type: string
 *           format: date
 *         to:
 *           type: string
 *           format: date
 *         noOfStaff:
 *           type: integer
 *         totalValue:
 *           type: number
 *           format: float
 */

class PayrollRecordRoutes {
    constructor() {
        this.controller = new PayrollRecordController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/payroll-records/:
         *   post:
         *     summary: Create a payroll record
         *     tags: [payroll-records]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollRecordCreateDto'
         *     responses:
         *       201:
         *         description: Payroll record created successfully
         */
        this.router.post("/", PayrollRecordDto.createPayrollRecordDto, this.controller.createPayrollRecord);

        /**
         * @swagger
         * /api/v1/payroll-records/:
         *   put:
         *     summary: Update a payroll record
         *     tags: [payroll-records]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollRecordUpdateDto'
         *     responses:
         *       200:
         *         description: Payroll record updated successfully
         */
        this.router.put("/", PayrollRecordDto.updatePayrollRecordDto, this.controller.updatePayrollRecord);

        /**
         * @swagger
         * /api/v1/payroll-records/cycle/{payrollCycleId}:
         *   get:
         *     summary: Get all payroll records for a specific payroll cycle
         *     tags: [payroll-records]
         *     parameters:
         *       - in: path
         *         name: payrollCycleId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of payroll records retrieved successfully
         */
        this.router.get("/cycle/:payrollCycleId", this.controller.getPayrollRecordsByCycle);

        /**
         * @swagger
         * /api/v1/payroll-records/{id}:
         *   get:
         *     summary: Get a single payroll record by ID
         *     tags: [payroll-records]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payroll record retrieved successfully
         */
        this.router.get("/:id", this.controller.getSinglePayrollRecord);

        /**
         * @swagger
         * /api/v1/payroll-records/tenant/{tenantId}:
         *   get:
         *     summary: Get all payroll records for a specific tenant
         *     tags: [payroll-records]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of payroll records retrieved successfully
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantPayrollRecords);

    }

    getRouter() {
        return this.router;
    }
}

export default new PayrollRecordRoutes().getRouter();
