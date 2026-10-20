import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollCycleStaffIncomeItemsRepository from "../../infrastructure/payrollCycleStaffIncomeItemsRepository.js";
import PayrollCycleStaffIncomeItemsService from "../../application/payrollCycleStaffIncomeItemsService.js";
import PayrollCycleStaffIncomeItem from "../../domain/payrollCycleStaffIncomeItem.js";

class PayrollCycleStaffIncomeItemsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new PayrollCycleStaffIncomeItemsRepository(
            this.prisma.payrollCycleStaffIncomeItems
        );
        this.service = new PayrollCycleStaffIncomeItemsService({
            payrollCycleStaffIncomeItemsRepository: this.repository
        });
    }

    createPayrollCycleStaffIncomeItem = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const incomeItemData = new PayrollCycleStaffIncomeItem(data);

        const incomeItem = await this.service.createPayrollCycleStaffIncomeItem(
            incomeItemData.createPayrollCycleStaffIncomeItem
        );

        if (!incomeItem) {
            return res.status(500).json({ message: "Failed to create income item" });
        }

        return res.status(201).json({
            message: "Income item created successfully",
            status: "ok",
            data: incomeItem
        });
    });

    updatePayrollCycleStaffIncomeItem = expressAsyncHandler(async (req, res) => {
        const incomeItem = await this.service.updatePayrollCycleStaffIncomeItem(
            req.body
        );

        if (!incomeItem) {
            return res.status(500).json({ message: "Failed to update income item" });
        }

        return res.status(200).json({
            message: "Income item updated successfully",
            status: "ok",
            data: incomeItem
        });
    });

    getSinglePayrollCycleStaffIncomeItem = expressAsyncHandler(async (req, res) => {
        const incomeItem = await this.service.getSinglePayrollCycleStaffIncomeItem(
            req.params
        );

        if (!incomeItem) {
            return res.status(404).json({ message: "Income item not found" });
        }

        return res.status(200).json({
            message: "Income item fetched successfully",
            status: "ok",
            data: incomeItem
        });
    });

    getStaffIncomeItems = expressAsyncHandler(async (req, res) => {
        const incomeItems = await this.service.getStaffIncomeItems(
            req.params.payrollCycleStaffId
        );

        if (!incomeItems) {
            return res.status(404).json({ message: "No income items found" });
        }

        return res.status(200).json({
            message: "Income items fetched successfully",
            status: "ok",
            data: incomeItems
        });
    });

    deactivatePayrollCycleStaffIncomeItem = expressAsyncHandler(async (req, res) => {
        const incomeItem = await this.service.updatePayrollCycleStaffIncomeItem({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!incomeItem) {
            return res.status(500).json({ message: "Failed to deactivate income item" });
        }

        return res.status(200).json({
            message: "Income item status updated successfully",
            status: "ok",
            data: incomeItem
        });
    });
}

export default PayrollCycleStaffIncomeItemsController;
