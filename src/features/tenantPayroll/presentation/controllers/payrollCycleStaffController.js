import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollCycleStaffRepository from "../../infrastructure/payrollCycleStaffRepository.js";
import PayrollCycleStaffService from "../../application/payrollCycleStaffService.js";
import PayrollCycleStaff from "../../domain/payrollCycleStaff.js";

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
}

export default PayrollCycleStaffController;
