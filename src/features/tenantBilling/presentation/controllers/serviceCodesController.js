import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ServiceCodesRepository from "../../infrastructure/serviceCodesRepository.js";
import ServiceCodesService from "../../application/serviceCodesService.js";
import ServiceCodes from "../../domain/serviceCodes.js";

class ServiceCodesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.serviceCodesRepository = new ServiceCodesRepository(this.prisma.serviceCodes);
        this.service = new ServiceCodesService({ serviceCodesRepository: this.serviceCodesRepository });
    }

    createServiceCode = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const serviceCodeData = new ServiceCodes(data);
        const serviceCode = await this.service.createServiceCode(serviceCodeData.createServiceCode);

        if (!serviceCode) {
            return res.status(500).json({ message: "Failed to create service code" });
        }

        return res.status(201).json({
            message: "Service code created successfully",
            status: "ok",
            data: serviceCode
        });
    });

    updateServiceCode = expressAsyncHandler(async (req, res) => {
        const serviceCode = await this.service.updateServiceCode(req.body);

        if (!serviceCode) {
            return res.status(500).json({ message: "Failed to update service code" });
        }

        return res.status(200).json({
            message: "Service code updated successfully",
            status: "ok",
            data: serviceCode
        });
    });

    getSingleServiceCode = expressAsyncHandler(async (req, res) => {
        const serviceCode = await this.service.getSingleServiceCode(req.params);

        if (!serviceCode) {
            return res.status(404).json({ message: "Service code not found" });
        }

        return res.status(200).json({
            message: "Service code fetched successfully",
            status: "ok",
            data: serviceCode
        });
    });

    getTenantServiceCodes = expressAsyncHandler(async (req, res) => {
        const serviceCodes = await this.service.getTenantServiceCodes(req.params.tenantId);

        if (!serviceCodes) {
            return res.status(404).json({ message: "No service codes found" });
        }

        return res.status(200).json({
            message: "Service codes fetched successfully",
            status: "ok",
            data: serviceCodes
        });
    });

    deactivateServiceCode = expressAsyncHandler(async (req, res) => {
        const serviceCode = await this.service.updateServiceCode({ id: req.params.id, isActive: req.params.active });

        if (!serviceCode) {
            return res.status(500).json({ message: "Failed to delete service code" });
        }

        return res.status(200).json({
            message: "Service code deleted successfully",
            status: "ok",
            data: serviceCode
        });
    });
}

export default ServiceCodesController;
