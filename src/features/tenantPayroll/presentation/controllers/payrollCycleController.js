import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollCycleRepository from "../../infrastructure/payrollCycleRepository.js";
import PayrollCycleService from "../../application/payrollCycleService.js";
import PayrollCycle from "../../domain/payrollCycle.js";
import PayrollCycleStaffRepository from "../../infrastructure/payrollCycleStaffRepository.js";
import PayrollCycleStaffService from "../../application/payrollCycleStaffService.js";
import StaffRepository from "../../../tenant/infrastructure/staffRepository.js";
import TenantService from "../../../tenant/application/tenantService.js";
import PayrollRepository from "../../../organizationStaff/infrastructure/payrollRepository.js";
import PayrollService from "../../../organizationStaff/application/payrollService.js";

class PayrollCycleController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payrollCycleRepository = new PayrollCycleRepository(this.prisma.payrollCycles);
        this.service = new PayrollCycleService({ payrollCycleRepository: this.payrollCycleRepository });
        this.payrollCycleStaffRepository = new PayrollCycleStaffRepository(this.prisma.payrollCycleStaffs);
        this.payrollCycleStaffService = new PayrollCycleStaffService({ payrollCycleStaffRepository: this.payrollCycleStaffRepository });
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.tenantService = new TenantService({ staffRepository: this.staffRepository });
        this.payrollRepository = new PayrollRepository(this.prisma.tenantStaffPayroll);
        this.payrollService = new PayrollService({
            payrollRepository: this.payrollRepository
        });
    }

    createPayrollCycle = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const payrollCycleData = new PayrollCycle(data);
        const payrollCycle = await this.service.createPayrollCycle(payrollCycleData.createPayrollCycle);

        if (!payrollCycle) {
            return res.status(500).json({ message: "Failed to create payroll cycle" });
        }

        const staffs = await this.tenantService.getStaffByPaymentSchedule(payrollCycleData.tenantId, payrollCycleData.compensationType);

        for (const staff of staffs) {
            await this.payrollCycleStaffService.createPayrollCycleStaff({
                payrollCycleId: payrollCycle.id,
                staffId: staff.id
            });
        }

        return res.status(201).json({
            message: "Payroll cycle created successfully",
            status: "ok",
            data: payrollCycle
        });
    });

    manuallyCreatePayrollCycle = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (end <= start) {
            return res.status(400).json({
                message: "End date must be greater than start date"
            });
        }

        const interval = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const payrollCycleData = {
            tenantId: data.tenantId,
            compensationType: data.compensationType,
            interval,
            startDate: start.toISOString().split("T")[0]
        };

        const payrollCycle = await this.service.createPayrollCycle(payrollCycleData);

        if (!payrollCycle) {
            return res.status(500).json({
                message: "Failed to create payroll cycle"
            });
        }

        for (const staff of data.staffs) {

            await this.payrollCycleStaffService.createPayrollCycleStaff({
                payrollCycleId: payrollCycle.id,
                staffId: staff.id
            });

            await this.payrollService.updatePayroll({
                id: staff.payrollId,
                deductions: staff.deductions,
                incomeItems: staff.incomeItems
            });
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

    getPayrollCyclesStatsByTenant = expressAsyncHandler(async (req, res) => {
        const payrollCycles = await this.service.getPayrollCyclesStatsByTenant(req.params.tenantId);

        if (!payrollCycles) {
            return res.status(404).json({ message: "No payroll cycles found" });
        }

        return res.status(200).json({
            message: "Payroll cycles fetched successfully",
            status: "ok",
            data: payrollCycles
        });
    });

    findPayrollCyclesByStaff = expressAsyncHandler(async (req, res) => {
        const payrollCycles = await this.service.findPayrollCyclesByStaff(req.params.staffId);

        if (!payrollCycles) {
            return res.status(404).json({ message: "No payroll cycles found" });
        }

        return res.status(200).json({
            message: "Payroll cycles fetched successfully",
            status: "ok",
            data: payrollCycles
        });
    });
}

export default PayrollCycleController;
