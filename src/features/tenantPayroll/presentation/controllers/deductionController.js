import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DeductionRepository from "../../infrastructure/deductionRepository.js";
import DeductionService from "../../application/deductionService.js";
import Deduction from "../../domain/deduction.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class DeductionController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.deductionRepository = new DeductionRepository(this.prisma.deductions);
        this.service = new DeductionService({ deductionRepository: this.deductionRepository });
    }

    createDeduction = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const deductionData = new Deduction(data);
        const deduction = await this.service.createDeduction(deductionData.createDeduction);

        if (!deduction) {
            return res.status(500).json({ message: "Failed to create deduction" });
        }

        await auditLogger.log(req, {
            tenantId: deduction.tenantId || req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Deduction Management",
            action: `created deduction ${deduction.id}`,
            reason: "Deduction management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Deduction created successfully",
            status: "ok",
            data: deduction
        });
    });

    updateDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.updateDeduction(req.body);

        if (!deduction) {
            return res.status(500).json({ message: "Failed to update deduction" });
        }

        await auditLogger.log(req, {
            tenantId: deduction.tenantId || req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Deduction Management",
            action: `updated deduction ${deduction.id}`,
            reason: "Deduction management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Deduction updated successfully",
            status: "ok",
            data: deduction
        });
    });

    getSingleDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.getSingleDeduction(req.params);

        if (!deduction) {
            return res.status(404).json({ message: "Deduction not found" });
        }

        return res.status(200).json({
            message: "Deduction fetched successfully",
            status: "ok",
            data: deduction
        });
    });

    getTenantDeductions = expressAsyncHandler(async (req, res) => {
        const deductions = await this.service.getTenantDeductions(req.params.tenantId);

        if (!deductions) {
            return res.status(404).json({ message: "No deductions found" });
        }

        return res.status(200).json({
            message: "Deductions fetched successfully",
            status: "ok",
            data: deductions
        });
    });

    deleteDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.deleteDeduction({
            id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!deduction) {
            return res.status(404).json({ message: "Deduction not found" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Deduction Management",
            action: `deleted deduction ${req.params.id}`,
            reason: "Deduction management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({ message: "Deduction deleted" });
    });

    deactivateDeduction = expressAsyncHandler(async (req, res) => {
        const deduction = await this.service.updateDeduction({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!deduction) {
            return res.status(500).json({ message: "Failed to deactivate deduction" });
        }

        await auditLogger.log(req, {
            tenantId: deduction.tenantId || req.user?.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Deduction Management",
            action: `${req.params.active === "true" ? "activated" : "deactivated"} deduction ${deduction.id}`,
            reason: "Deduction management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Deduction deactivated successfully",
            status: "ok",
            data: deduction
        });
    });
}

export default DeductionController;
