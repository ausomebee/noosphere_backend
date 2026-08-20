import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollCycleStaffRepository from "../../infrastructure/payrollCycleStaffRepository.js";
import PayrollCycleStaffService from "../../application/payrollCycleStaffService.js";
import PayrollCycleStaff from "../../domain/payrollCycleStaff.js";
import PayrollRepository from "../../../organizationStaff/infrastructure/payrollRepository.js";
import PayrollService from "../../../organizationStaff/application/payrollService.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class PayrollCycleStaffController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payrollCycleStaffRepository =
            new PayrollCycleStaffRepository(
                this.prisma.payrollCycleStaffs
            );
        this.service = new PayrollCycleStaffService({
            payrollCycleStaffRepository:
                this.payrollCycleStaffRepository
        });
        this.payrollRepository = new PayrollRepository(this.prisma.tenantStaffPayroll);
        this.payrollService = new PayrollService({
            payrollRepository: this.payrollRepository
        });
    }

    createPayrollCycleStaff = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const payrollCycleStaffData =
            new PayrollCycleStaff(data);

        const record =
            await this.service.createPayrollCycleStaff(
                payrollCycleStaffData.createPayrollCycleStaff
            );

        if (!record) {
            return res.status(500).json({
                message: "Failed to assign staff to payroll cycle"
            });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Payroll Cycle",
            action: `assigned staff to payroll cycle ${record.payrollCycleId}`,
            reason: "Payroll cycle staff management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Staff assigned to payroll cycle successfully",
            status: "ok",
            data: record
        });
    });

    updatePayrollCycleStaff = expressAsyncHandler(async (req, res) => {
        const record =
            await this.service.updatePayrollCycleStaff(req.body);

        if (!record) {
            return res.status(500).json({
                message: "Failed to update payroll cycle staff record"
            });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Payroll Cycle",
            action: `updated payroll cycle staff record ${record.id}`,
            reason: "Payroll cycle staff management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Payroll cycle staff record updated successfully",
            status: "ok",
            data: record
        });
    });

    getSinglePayrollCycleStaff = expressAsyncHandler(async (req, res) => {
        const record =
            await this.service.getSinglePayrollCycleStaff(req.params);

        if (!record) {
            return res.status(404).json({
                message: "Payroll cycle staff record not found"
            });
        }

        return res.status(200).json({
            message: "Payroll cycle staff record fetched successfully",
            status: "ok",
            data: record
        });
    });

    deletePayrollCycleStaff = expressAsyncHandler(async (req, res) => {
        const record = await this.service.deletePayrollCycleStaff(req.params);

        if (!record) {
            return res.status(500).json({
                message: "Failed to delete payroll cycle staff record"
            });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Payroll Cycle",
            action: `deleted payroll cycle staff record ${req.params.id}`,
            reason: "Payroll cycle staff management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Payroll cycle staff record deleted successfully",
            status: "ok",
            data: record
        });
    });

    getPayrollCycleStaffs = expressAsyncHandler(async (req, res) => {
        const records =
            await this.service.getPayrollCycleStaffs(
                req.params.payrollCycleId
            );

        if (!records || records.length === 0) {
            return res.status(404).json({
                message: "No staff found for this payroll cycle"
            });
        }

        return res.status(200).json({
            message: "Payroll cycle staff fetched successfully",
            status: "ok",
            data: records
        });
    });

    editBreakdown = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        for (const staff of data.staffs) {
            if (staff.id) {
                const record = await this.service.getSinglePayrollCycleStaff({id: staff.id});

                if (!record) {
                    return res.status(404).json({
                        message: "Payroll cycle staff record not found"
                    });
                }

                await this.payrollService.updatePayroll({
                    id: staff.staffPayrollId,
                    deductions: staff.deductions,
                    incomeItems: staff.incomeItems
                });
            } else {
                await this.service.createPayrollCycleStaff({
                    payrollCycleId: staff.payrollCycleId,
                    staffId: staff.staffId
                });

                await this.payrollService.updatePayroll({
                    id: staff.staffPayrollId,
                    deductions: staff.deductions,
                    incomeItems: staff.incomeItems
                });
            }
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Payroll Cycle",
            action: "updated payroll breakdown",
            reason: "Payroll cycle staff management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Payroll breakdown updated successfully"
        });
    });
}

export default PayrollCycleStaffController;
