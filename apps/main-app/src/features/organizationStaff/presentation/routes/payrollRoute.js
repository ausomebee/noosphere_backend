import express from "express";
import PayrollController from "../controller/payrollController.js";
import PayrollDto from "../dto/payrollDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PayrollUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - paymentSchedule
 *         - ratePerHour
 *         - tenantStaffId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the payroll
 *         paymentSchedule:
 *           type: string
 *           description: Payment schedule
 *           example: "Monthly"
 *         ratePerHour:
 *           type: string
 *           description: Hourly rate
 *           example: "50.00"
 *         tenantStaffId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the staff member
 *         minimumHours:
 *           type: string
 *           description: Minimum hours required
 *           example: "40"
 *         otherPays:
 *           type: object
 *           description: Additional pay details
 *         deductions:
 *           type: object
 *           description: Deduction details
 */

class PayrollRoutes {
    constructor() {
        this.controller = new PayrollController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization-staff/payroll/:
         *   put:
         *     summary: Update a tenant staff payroll
         *     tags: [organization-staff]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PayrollUpdateDto'
         *     responses:
         *       200:
         *         description: Payroll updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Payroll not found
         */
        this.router.put("/", staffProtect(), PayrollDto.updatePayrollDto, this.controller.updatePayroll);

        /**
         * @swagger
         * /api/v1/organization-staff/payroll/tenant-staff/{tenantStaffId}:
         *   get:
         *     summary: Get all payrolls for a tenant staff
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: tenantStaffId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the tenant staff
         *     responses:
         *       200:
         *         description: Payrolls fetched successfully
         *       404:
         *         description: Payrolls not found
         */
        this.router.get("/tenant-staff/:tenantStaffId", staffProtect(), this.controller.getTenantStaffPayrolls);

        /**
         * @swagger
         * /api/v1/organization-staff/payroll/{id}:
         *   get:
         *     summary: Get a single tenant staff payroll
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the payroll
         *     responses:
         *       200:
         *         description: Payroll fetched successfully
         *       404:
         *         description: Payroll not found
         */
        this.router.get("/:id", staffProtect(), this.controller.getPayroll);

        /**
         * @swagger
         * /api/v1/organization-staff/payroll/deleted/{id}/{isDeleted}:
         *   patch:
         *     summary: Mark a tenant staff payroll as deleted or not
         *     tags: [organization-staff]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the payroll
         *       - in: path
         *         name: isDeleted
         *         required: true
         *         schema:
         *           type: boolean
         *         description: Set to `true` to mark as deleted or `false` to restore
         *     responses:
         *       200:
         *         description: Payroll status updated successfully
         *       400:
         *         description: Invalid request
         *       404:
         *         description: Payroll not found
         */
        this.router.patch("/deleted/:id/:isDeleted", staffProtect(), this.controller.updatePayroll);
    }

    getRouter() {
        return this.router;
    }
}

export default new PayrollRoutes().getRouter();