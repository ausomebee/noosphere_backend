import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayerRepository from "../../infrastructure/payerRepository.js";
import PayerService from "../../application/payerService.js";
import Payer from "../../domain/payer.js";
import PayerServiceCodesRepository from "../../infrastructure/payerServiceCodesRepository.js";
import PayerServiceCodesService from "../../application/payerServiceCodesService.js";
import PayerServiceCodes from "../../domain/payerServiceCodes.js";
import ServiceCodesService from "../../application/serviceCodesService.js";
import ServiceCodesRepository from "../../infrastructure/serviceCodesRepository.js";
import ServiceCodes from "../../domain/serviceCodes.js";

class PayerController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payerRepository = new PayerRepository(this.prisma.payer);
        this.payerServiceCodesRepository = new PayerServiceCodesRepository(this.prisma.payerServiceCodes);
        this.serviceCodesRepository = new ServiceCodesRepository(this.prisma.serviceCodes);
        this.serviceCodesService = new ServiceCodesService({ serviceCodesRepository: this.serviceCodesRepository });
        this.service = new PayerService({ payerRepository: this.payerRepository });
        this.payerServiceCodesService = new PayerServiceCodesService({ payerServiceCodesRepository: this.payerServiceCodesRepository });
    }

    createPayer = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const payerData = new Payer(data);
        const payer = await this.service.createPayer(payerData.createPayer);

        if (!payer) {
            return res.status(500).json({ message: "Failed to create payer" });
        }

        for (const serviceCode of data.serviceCodes) {
            if (serviceCode.serviceCodeId) {
                const payerServiceCodeData = new PayerServiceCodes({ ...serviceCode, payerId: payer.id });
                const payerServiceCode = await this.payerServiceCodesService.createPayerServiceCode(payerServiceCodeData.createPayerServiceCode);

                if (!payerServiceCode) {
                    return res.status(500).json({ message: "Failed to create payer service code" });
                }
            } else {
                const serviceCodeData = new ServiceCodes({ ...serviceCode, tenantId: data.tenantId });
                const serviceCode = await this.service.createServiceCode(serviceCodeData.createServiceCode);

                if (!serviceCode) {
                    return res.status(500).json({ message: "Failed to create service code" });
                }

                const payerServiceCodeData = new PayerServiceCodes({ ...serviceCode, payerId: payer.id, serviceCodeId: serviceCode.id });
                const payerServiceCode = await this.payerServiceCodesService.createPayerServiceCode(payerServiceCodeData.createPayerServiceCode);

                if (!payerServiceCode) {
                    return res.status(500).json({ message: "Failed to create payer service code" });
                }
            }
        }

        return res.status(201).json({
            message: "Payer created successfully",
            status: "ok",
            data: payer
        });
    });

    updatePayer = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const payerData = new Payer(data);
        const updatedPayer = await this.service.updatePayer(payerData.updatePayer);

        if (!updatedPayer) {
            return res.status(404).json({ message: "Payer not found or failed to update" });
        }

        for (const serviceCode of data.serviceCodes) {
            if (serviceCode.id) {
                const payerServiceCodeData = new PayerServiceCodes({
                    ...serviceCode,
                    payerId: data.id,
                });

                const updatedPayerServiceCode =
                    await this.payerServiceCodesService.updatePayerServiceCode(
                        payerServiceCodeData.updatePayerServiceCode
                    );

                if (!updatedPayerServiceCode) {
                    return res
                        .status(500)
                        .json({ message: "Failed to update payer service code" });
                }
            } else {
                if (serviceCode.serviceCodeId) {
                    const payerServiceCodeData = new PayerServiceCodes({
                        ...serviceCode,
                        payerId: data.id,
                    });

                    const payerServiceCode =
                        await this.payerServiceCodesService.createPayerServiceCode(
                            payerServiceCodeData.createPayerServiceCode
                        );

                    if (!payerServiceCode) {
                        return res
                            .status(500)
                            .json({ message: "Failed to create payer service code" });
                    }
                } else {
                    const serviceCodeData = new ServiceCodes({
                        ...serviceCode,
                        tenantId: data.tenantId,
                    });

                    const newServiceCode = await this.service.createServiceCode(
                        serviceCodeData.createServiceCode
                    );

                    if (!newServiceCode) {
                        return res
                            .status(500)
                            .json({ message: "Failed to create new service code" });
                    }

                    const payerServiceCodeData = new PayerServiceCodes({
                        ...serviceCode,
                        payerId: data.id,
                        serviceCodeId: newServiceCode.id,
                    });

                    const payerServiceCode =
                        await this.payerServiceCodesService.createPayerServiceCode(
                            payerServiceCodeData.createPayerServiceCode
                        );

                    if (!payerServiceCode) {
                        return res
                            .status(500)
                            .json({ message: "Failed to create payer service code" });
                    }
                }
            }
        }

        return res.status(200).json({
            message: "Payer updated successfully",
            status: "ok",
            data: updatedPayer,
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

    deactivatePayer = expressAsyncHandler(async (req, res) => {
        const payer = await this.service.updatePayer({
            id: req.params.id,
            isActive: req.params.active === "true"
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
