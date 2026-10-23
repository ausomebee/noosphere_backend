import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import CompensationTypeRepository from "../../infrastructure/compensationTypeRepository.js";
import CompensationTypeService from "../../application/compensationTypeService.js";
import CompensationType from "../../domain/compensationType.js";

class CompensationTypeController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.compensationTypeRepository = new CompensationTypeRepository(this.prisma.compensationTypes);
        this.service = new CompensationTypeService({ compensationTypeRepository: this.compensationTypeRepository });
    }

    createCompensationType = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const compData = new CompensationType(data);
        const compensationType = await this.service.createCompensationType(compData.createCompensationType);

        if (!compensationType) {
            return res.status(500).json({ message: "Failed to create compensation type" });
        }

        return res.status(201).json({
            message: "Compensation type created successfully",
            status: "ok",
            data: compensationType
        });
    });

    updateCompensationType = expressAsyncHandler(async (req, res) => {
        const compensationType = await this.service.updateCompensationType(req.body);

        if (!compensationType) {
            return res.status(500).json({ message: "Failed to update compensation type" });
        }

        return res.status(200).json({
            message: "Compensation type updated successfully",
            status: "ok",
            data: compensationType
        });
    });

    getSingleCompensationType = expressAsyncHandler(async (req, res) => {
        const compensationType = await this.service.getSingleCompensationType(req.params);

        if (!compensationType) {
            return res.status(404).json({ message: "Compensation type not found" });
        }

        return res.status(200).json({
            message: "Compensation type fetched successfully",
            status: "ok",
            data: compensationType
        });
    });

    getTenantCompensationTypes = expressAsyncHandler(async (req, res) => {
        const compensationTypes = await this.service.getTenantCompensationTypes(req.params.tenantId);

        if (!compensationTypes) {
            return res.status(404).json({ message: "No compensation types found" });
        }

        return res.status(200).json({
            message: "Compensation types fetched successfully",
            status: "ok",
            data: compensationTypes
        });
    });

    deactivateCompensationType = expressAsyncHandler(async (req, res) => {
        const compensationType = await this.service.updateCompensationType({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!compensationType) {
            return res.status(500).json({ message: "Failed to deactivate compensation type" });
        }

        return res.status(200).json({
            message: "Compensation type deactivated successfully",
            status: "ok",
            data: compensationType
        });
    });
}

export default CompensationTypeController;
