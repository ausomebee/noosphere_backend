import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import IncomeItemRepository from "../../infrastructure/incomeItemRepository.js";
import IncomeItemService from "../../application/incomeItemService.js";
import IncomeItem from "../../domain/incomeItem.js";

class IncomeItemController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.incomeItemRepository = new IncomeItemRepository(this.prisma.incomeItems);
        this.service = new IncomeItemService({ incomeItemRepository: this.incomeItemRepository });
    }

    createIncomeItem = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const incomeItemData = new IncomeItem(data);
        const incomeItem = await this.service.createIncomeItem(incomeItemData.createIncomeItem);

        if (!incomeItem) {
            return res.status(500).json({ message: "Failed to create income item" });
        }

        return res.status(201).json({
            message: "Income item created successfully",
            status: "ok",
            data: incomeItem
        });
    });

    updateIncomeItem = expressAsyncHandler(async (req, res) => {
        const incomeItem = await this.service.updateIncomeItem(req.body);

        if (!incomeItem) {
            return res.status(500).json({ message: "Failed to update income item" });
        }

        return res.status(200).json({
            message: "Income item updated successfully",
            status: "ok",
            data: incomeItem
        });
    });

    getSingleIncomeItem = expressAsyncHandler(async (req, res) => {
        const incomeItem = await this.service.getSingleIncomeItem(req.params);

        if (!incomeItem) {
            return res.status(404).json({ message: "Income item not found" });
        }

        return res.status(200).json({
            message: "Income item fetched successfully",
            status: "ok",
            data: incomeItem
        });
    });

    getTenantIncomeItems = expressAsyncHandler(async (req, res) => {
        const incomeItems = await this.service.getTenantIncomeItems(req.params.tenantId);

        if (!incomeItems) {
            return res.status(404).json({ message: "No income items found" });
        }

        return res.status(200).json({
            message: "Income items fetched successfully",
            status: "ok",
            data: incomeItems
        });
    });

    deactivateIncomeItem = expressAsyncHandler(async (req, res) => {
        const incomeItem = await this.service.updateIncomeItem({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!incomeItem) {
            return res.status(500).json({ message: "Failed to deactivate income item" });
        }

        return res.status(200).json({
            message: "Income item deactivated successfully",
            status: "ok",
            data: incomeItem
        });
    });
}

export default IncomeItemController;
