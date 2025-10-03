import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayerRepository from "../../infrastructure/payerRepository.js";
import PayerService from "../../application/payerService.js";
import Payer from "../../domain/payer.js";

class PayerController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new PayerRepository(this.prisma.payer);
        this.service = new PayerService({ repository: this.repository });
    }

    createPayer = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const payerData = new Payer(data);
        const payer = await this.service.createPayer(payerData.createPayer);

        if (!payer) {
            return res.status(500).json({ message: "Failed to create payer" });
        }

        return res.status(201).json({
            message: "Payer created successfully",
            status: "ok",
            data: payer
        });
    });

    updatePayer = expressAsyncHandler(async (req, res) => {
        const payer = await this.service.updatePayer(req.body);

        if (!payer) {
            return res.status(500).json({ message: "Failed to update payer" });
        }

        return res.status(200).json({
            message: "Payer updated successfully",
            status: "ok",
            data: payer
        });
    });

    getSinglePayer = expressAsyncHandler(async (req, res) => {
        const payer = await this.service.getSinglePayer(req.params);

        if (!payer) {
            return res.status(404).json({ message: "Payer not found" });
        }

        return res.status(200).json({
            message: "Payer fetched successfully",
            status: "ok",
            data: payer
        });
    });

    getTenantPayers = expressAsyncHandler(async (req, res) => {
        const payers = await this.service.getTenantPayers(req.params.tenantId);

        if (!payers) {
            return res.status(404).json({ message: "No payers found" });
        }

        return res.status(200).json({
            message: "Payers fetched successfully",
            status: "ok",
            data: payers
        });
    });

    deletePayer = expressAsyncHandler(async (req, res) => {
        const payer = await this.service.updatePayer({
            id: req.params.id,
            isDeleted: true
        });

        if (!payer) {
            return res.status(500).json({ message: "Failed to delete payer" });
        }

        return res.status(200).json({
            message: "Payer deleted successfully",
            status: "ok",
            data: payer
        });
    });
}

export default PayerController;
