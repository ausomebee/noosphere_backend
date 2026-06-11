import express from "express";
import PayrollCycleStaffController from "../controllers/payrollCycleStaffController.js";
import PayrollCycleStaffDto from "../dto/payrollCycleStaffDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
            this.controller.deletePayrollCycleStaff
        );

        /**
         * @swagger
         * /api/v1/payroll-cycle-staffs/edit-breakdown:
         *   put:
         *     summary: Create or update payroll cycle staff breakdown
         *     description: |
         *       Updates payroll breakdown for multiple staff.
         *       If `id` is provided, it updates an existing payroll cycle staff record.
         *       If `id` is not provided, it creates a new payroll cycle staff record and updates the payroll breakdown.
         *     tags:
         *       - payroll-cycle-staffs
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - staffs
         *             properties:
         *               staffs:
         *                 type: array
         *                 minItems: 1
         *                 items:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: string
         *                       format: uuid
         *                       description: Payroll cycle staff record ID (required for update)
         *                     payrollCycleId:
         *                       type: string
         *                       format: uuid
         *                       description: Payroll cycle ID (required for create)
         *                     staffId:
         *                       type: string
         *                       format: uuid
         *                       description: Staff ID (required for create)
         *                     staffPayrollId:
         *                       type: string
         *                       format: uuid
         *                       description: Payroll record ID to update
         *                     deductions:
         *                       type: array
         *                       description: List of deductions to attach to payroll
         *                       items:
         *                         type: object
         *                         required:
         *                           - id
         *                         properties:
         *                           id:
         *                             type: string
         *                             format: uuid
         *                     incomeItems:
         *                       type: array
         *                       description: List of income items to attach to payroll
         *                       items:
         *                         type: object
         *                         required:
         *                           - id
         *                         properties:
         *                           id:
         *                             type: string
         *                             format: uuid
         *     responses:
         *       200:
         *         description: Payroll breakdown updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Payroll breakdown updated successfully
         *       400:
         *         description: Invalid request payload
         *       404:
         *         description: Payroll cycle staff record not found
         *       500:
         *         description: Internal server error
         */
        this.router.put(
            "/edit-breakdown",
            staffProtect(),
            this.controller.editBreakdown
        );

    }

    getRouter() {
        return this.router;
    }
}

export default new PayrollCycleStaffRoutes().getRouter();
