import express from "express";
import PayrollCycleStaffController from "../controllers/payrollCycleStaffController.js";
import PayrollCycleStaffDto from "../dto/payrollCycleStaffDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PayrollCycleStaffCreateDto:
 *       type: object
 *       required:
 *         - payrollCycleId
 *         - staffId
 *       properties:
 *         payrollCycleId:
 *           type: string
 *           format: uuid
 *           description: Unique payroll cycle identifier
 *         staffId:
 *           type: string
 *           format: uuid
 *           description: Unique staff identifier
 *
 *     PayrollCycleStaffUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique payroll cycle staff record ID
 *         payrollCycleId:
 *           type: string
 *           format: uuid
 *           description: Updated payroll cycle ID
 *         staffId:
 *           type: string
 *           format: uuid
 *           description: Updated staff ID
 */

class PayrollCycleStaffRoutes {
    constructor() {
        this.controller = new PayrollCycleStaffController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/payroll-cycle-staffs/:
         *   post:
         *     summary: Assign staff to a payroll cycle
         *     tags: [payroll-cycle-staffs]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollCycleStaffCreateDto'
         *     responses:
         *       201:
         *         description: Staff assigned successfully
         */
        this.router.post(
            "/",
            PayrollCycleStaffDto.createPayrollCycleStaffDto,
            this.controller.createPayrollCycleStaff
        );

        /**
         * @swagger
         * /api/v1/payroll-cycle-staffs/:
         *   put:
         *     summary: Update payroll cycle staff record
         *     tags: [payroll-cycle-staffs]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollCycleStaffUpdateDto'
         *     responses:
         *       200:
         *         description: Payroll cycle staff record updated successfully
         */
        this.router.put(
            "/",
            PayrollCycleStaffDto.updatePayrollCycleStaffDto,
            this.controller.updatePayrollCycleStaff
        );

        /**
         * @swagger
         * /api/v1/payroll-cycle-staffs/cycle/{payrollCycleId}:
         *   get:
         *     summary: Get all staff assigned to a payroll cycle
         *     tags: [payroll-cycle-staffs]
         *     parameters:
         *       - in: path
         *         name: payrollCycleId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of staff retrieved successfully
         */
        this.router.get(
            "/cycle/:payrollCycleId",
            this.controller.getPayrollCycleStaffs
        );

        /**
         * @swagger
         * /api/v1/payroll-cycle-staffs/{id}:
         *   get:
         *     summary: Get a single payroll cycle staff record by ID
         *     tags: [payroll-cycle-staffs]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payroll cycle staff record retrieved successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSinglePayrollCycleStaff
        );

        /**
         * @swagger
         * /api/v1/payroll-cycle-staffs/{id}:
         *   delete:
         *     summary: Remove staff from a payroll cycle
         *     tags: [payroll-cycle-staffs]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Staff removed from payroll cycle successfully
         */
        this.router.delete(
            "/:id",
            this.controller.deletePayrollCycleStaff
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new PayrollCycleStaffRoutes().getRouter();
