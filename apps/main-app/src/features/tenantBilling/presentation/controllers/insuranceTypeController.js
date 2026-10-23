import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import InsuranceTypeRepository from "../../infrastructure/insuranceTypeRepository.js";
import InsuranceTypeService from "../../application/insuranceTypeService.js";
import InsuranceType from "../../domain/insuranceType.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class InsuranceTypeController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.insuranceTypeRepository = new InsuranceTypeRepository(this.prisma.insuranceType);
        this.service = new InsuranceTypeService({ insuranceTypeRepository: this.insuranceTypeRepository });
    }

    createInsuranceType = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const insuranceTypeData = new InsuranceType(data);
        const insuranceType = await this.service.createInsuranceType(insuranceTypeData.createInsuranceType);

        if (!insuranceType) {
            return res.status(500).json({ message: "Failed to create insurance type" });
        }

        await auditLogger.log(req, {
            tenantId: insuranceType.tenantId || data.tenantId || req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Insurance Type Management",
            action: "created an insurance type",
            reason: "Insurance type created",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Insurance type created successfully",
            status: "ok",
            data: insuranceType
        });
    });

    updateInsuranceType = expressAsyncHandler(async (req, res) => {
        const insuranceType = await this.service.updateInsuranceType(req.body);

        if (!insuranceType) {
            return res.status(500).json({ message: "Failed to update insurance type" });
        }

        await auditLogger.log(req, {
            tenantId: insuranceType.tenantId || req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Insurance Type Management",
            action: `updated insurance type ${insuranceType.id}`,
            reason: "Insurance type updated",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Insurance type updated successfully",
            status: "ok",
            data: insuranceType
        });
    });

    getSingleInsuranceType = expressAsyncHandler(async (req, res) => {
        const insuranceType = await this.service.getSingleInsuranceType(req.params);

        if (!insuranceType) {
            return res.status(404).json({ message: "Insurance type not found" });
        }

        return res.status(200).json({
            message: "Insurance type fetched successfully",
            status: "ok",
            data: insuranceType
        });
    });

    getTenantInsuranceTypes = expressAsyncHandler(async (req, res) => {
        const insuranceTypes = await this.service.getTenantInsuranceTypes(req.params.tenantId);

        if (!insuranceTypes) {
            return res.status(404).json({ message: "No insurance types found" });
        }

        return res.status(200).json({
            message: "Insurance types fetched successfully",
            status: "ok",
            data: insuranceTypes
        });
    });

    deactivateInsuranceType = expressAsyncHandler(async (req, res) => {
        const insuranceType = await this.service.updateInsuranceType({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!insuranceType) {
            return res.status(500).json({ message: "Failed to deactivate insurance type" });
        }

        await auditLogger.log(req, {
            tenantId: insuranceType.tenantId || req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Insurance Type Management",
            action: `deactivated insurance type ${insuranceType.id}`,
            reason: "Insurance type deactivated",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Insurance type deactivated successfully",
            status: "ok",
            data: insuranceType
        });
    });
}

export default InsuranceTypeController;
