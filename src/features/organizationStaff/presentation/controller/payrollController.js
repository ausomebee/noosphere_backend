import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollRepository from "../../infrastructure/payrollRepository.js";
import PayrollService from "../../application/payrollService.js";

class PayrollController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payrollRepository = new PayrollRepository(this.prisma.tenantStaffPayroll);
        this.service = new PayrollService({
            payrollRepository: this.payrollRepository
        });
    }

    updatePayroll = expressAsyncHandler(async (req, res) => {
        const payload = {
            ...req.params,
            ...req.body,
            ...(req.params.isDeleted === "true" || req.params.isDeleted === "false"
                ? { isDeleted: req.params.isDeleted === "true" }
                : {}),
        };

        const payroll = await this.service.updatePayroll(payload);

        if (!payroll) {
            res.status(500).json({ message: "Failed to update payroll" });
        }

        return res.status(200).json({
            message: "Payroll updated successfully",
            status: "ok",
            data: payroll,
        });
    });

    getTenantStaffPayrolls = expressAsyncHandler(async (req, res) => {
        const payrolls = await this.service.getTenantStaffPayrolls(req.params.tenantStaffId);

        if (!payrolls) {
            res.status(404).json({ message: "Payrolls not found" });
        }

        return res.status(200).json({
            message: "Payrolls retrieved successfully",
            status: "ok",
            data: payrolls,
        });
    });

    getPayroll = expressAsyncHandler(async (req, res) => {
        const payroll = await this.service.getPayroll(req.params.id);

        if (!payroll) {
            res.status(404).json({ message: "Payroll not found" });
        }

        return res.status(200).json({
            message: "Payroll retrieved successfully",
            status: "ok",
            data: payroll,
        });
    });
}

export default PayrollController;