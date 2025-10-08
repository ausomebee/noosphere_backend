import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollCycleRepository from "../../infrastructure/payrollCycleRepository.js";
import PayrollCycleService from "../../application/payrollCycleService.js";
import PayrollCycle from "../../domain/payrollCycle.js";

class PayrollCycleController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payrollCycleRepository = new PayrollCycleRepository(this.prisma.payrollCycles);
        this.service = new PayrollCycleService({ payrollCycleRepository: this.payrollCycleRepository });
    }

    createPayrollCycle = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const payrollCycleData = new PayrollCycle(data);
        const payrollCycle = await this.service.createPayrollCycle(payrollCycleData.createPayrollCycle);

        if (!payrollCycle) {
            return res.status(500).json({ message: "Failed to create payroll cycle" });
        }

        return res.status(201).json({
            message: "Payroll cycle created successfully",
            status: "ok",
            data: payrollCycle
        });
    });

    updatePayrollCycle = expressAsyncHandler(async (req, res) => {
        const payrollCycle = await this.service.updatePayrollCycle(req.body);

        if (!payrollCycle) {
            return res.status(500).json({ message: "Failed to update payroll cycle" });
        }

        return res.status(200).json({
            message: "Payroll cycle updated successfully",
            status: "ok",
            data: payrollCycle
        });
    });

    getSinglePayrollCycle = expressAsyncHandler(async (req, res) => {
        const payrollCycle = await this.service.getSinglePayrollCycle(req.params);

        if (!payrollCycle) {
            return res.status(404).json({ message: "Payroll cycle not found" });
        }

        return res.status(200).json({
            message: "Payroll cycle fetched successfully",
            status: "ok",
            data: payrollCycle
        });
    });

    getTenantPayrollCycles = expressAsyncHandler(async (req, res) => {
        const payrollCycles = await this.service.getTenantPayrollCycles(req.params.tenantId);

        if (!payrollCycles) {
            return res.status(404).json({ message: "No payroll cycles found" });
        }

        return res.status(200).json({
            message: "Payroll cycles fetched successfully",
            status: "ok",
            data: payrollCycles
        });
    });

    deactivatePayrollCycle = expressAsyncHandler(async (req, res) => {
        const payrollCycle = await this.service.updatePayrollCycle({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!payrollCycle) {
            return res.status(500).json({ message: "Failed to deactivate payroll cycle" });
        }

        return res.status(200).json({
            message: "Payroll cycle deactivated successfully",
            status: "ok",
            data: payrollCycle
        });
    });
}

export default PayrollCycleController;
