import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollCycleStaffDeductionsRepository from "../../infrastructure/payrollCycleStaffDeductionsRepository.js";
import PayrollCycleStaffDeductionsService from "../../application/payrollCycleStaffDeductionsService.js";
import PayrollCycleStaffDeduction from "../../domain/payrollCycleStaffDeduction.js";

class PayrollCycleStaffDeductionsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new PayrollCycleStaffDeductionsRepository(
            this.prisma.payrollCycleStaffDeductions
        );
        this.service = new PayrollCycleStaffDeductionsService({
            payrollCycleStaffDeductionsRepository: this.repository
        });
    }

    createPayrollCycleStaffDeduction = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const deductionData = new PayrollCycleStaffDeduction(data);

        const deduction = await this.service.createPayrollCycleStaffDeduction(
            deductionData.createPayrollCycleStaffDeduction
        );

        if (!deduction) {
            return res.status(500).json({ message: "Failed to create deduction" });
        }

        return res.status(201).json({
            message: "Deduction created successfully",
            status: "ok",
            data: deduction
        });
    });

    updatePayrollCycleStaffDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.updatePayrollCycleStaffDeduction(
            req.body
        );

        if (!deduction) {
            return res.status(500).json({ message: "Failed to update deduction" });
        }

        return res.status(200).json({
            message: "Deduction updated successfully",
            status: "ok",
            data: deduction
        });
    });

    getSinglePayrollCycleStaffDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.getSinglePayrollCycleStaffDeduction(
            req.params
        );

        if (!deduction) {
            return res.status(404).json({ message: "Deduction not found" });
        }

        return res.status(200).json({
            message: "Deduction fetched successfully",
            status: "ok",
            data: deduction
        });
    });

    getStaffDeductions = expressAsyncHandler(async (req, res) => {
        const deductions = await this.service.getStaffDeductions(
            req.params.payrollCycleStaffId
        );

        if (!deductions) {
            return res.status(404).json({ message: "No deductions found" });
        }

        return res.status(200).json({
            message: "Deductions fetched successfully",
            status: "ok",
            data: deductions
        });
    });

    deactivatePayrollCycleStaffDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.updatePayrollCycleStaffDeduction({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!deduction) {
            return res.status(500).json({ message: "Failed to deactivate deduction" });
        }

        return res.status(200).json({
            message: "Deduction status updated successfully",
            status: "ok",
            data: deduction
        });
    });
}

export default PayrollCycleStaffDeductionsController;
