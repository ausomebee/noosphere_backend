import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayerServiceCodesRepository from "../../infrastructure/payerServiceCodesRepository.js";
import PayerServiceCodesService from "../../application/payerServiceCodesService.js";
import PayerServiceCodes from "../../domain/payerServiceCodes.js";

class PayerServiceCodesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payerServiceCodesRepository = new PayerServiceCodesRepository(this.prisma.payerServiceCodes);
        this.service = new PayerServiceCodesService({ payerServiceCodesRepository: this.payerServiceCodesRepository });
    }

    createPayerServiceCode = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const payerServiceCodeData = new PayerServiceCodes(data);
        const payerServiceCode = await this.service.createPayerServiceCode(payerServiceCodeData.createPayerServiceCode);

        if (!payerServiceCode) {
            return res.status(500).json({ message: "Failed to create payer service code" });
        }

        return res.status(201).json({
            message: "Payer service code created successfully",
            status: "ok",
            data: payerServiceCode
        });
    });

    updatePayerServiceCode = expressAsyncHandler(async (req, res) => {
        const payerServiceCode = await this.service.updatePayerServiceCode(req.body);

        if (!payerServiceCode) {
            return res.status(500).json({ message: "Failed to update payer service code" });
        }

        return res.status(200).json({
            message: "Payer service code updated successfully",
            status: "ok",
            data: payerServiceCode
        });
    });

    getSinglePayerServiceCode = expressAsyncHandler(async (req, res) => {
        const payerServiceCode = await this.service.getSinglePayerServiceCode(req.params);

        if (!payerServiceCode) {
            return res.status(404).json({ message: "Payer service code not found" });
        }

        return res.status(200).json({
            message: "Payer service code fetched successfully",
            status: "ok",
            data: payerServiceCode
        });
    });

    getPayerServiceCodes = expressAsyncHandler(async (req, res) => {
        const payerServiceCodes = await this.service.getPayerServiceCodes(req.params.payerId);

        if (!payerServiceCodes) {
            return res.status(404).json({ message: "No payer service codes found" });
        }

        return res.status(200).json({
            message: "Payer service codes fetched successfully",
            status: "ok",
            data: payerServiceCodes
        });
    });

    deletePayerServiceCode = expressAsyncHandler(async (req, res) => {
        const payerServiceCode = await this.service.updatePayerServiceCode({ id: req.params.id, isDeleted: true });

        if (!payerServiceCode) {
            return res.status(500).json({ message: "Failed to delete payer service code" });
        }

        return res.status(200).json({
            message: "Payer service code deleted successfully",
            status: "ok",
            data: payerServiceCode
        });
    });
}

export default PayerServiceCodesController;
