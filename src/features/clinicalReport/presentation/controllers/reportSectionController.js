import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportSectionRepository from "../../infrastructure/reportSectionRepository.js";
import ClinicalReportSectionService from "../../application/reportSectionService.js";
import ClinicalReportSection from "../../domain/reportSection.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class ClinicalReportSectionController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new ClinicalReportSectionRepository(
            this.prisma.clinicalReportSection
        );

        this.service = new ClinicalReportSectionService({
            repository: this.repository
        });
    }

    createSection = expressAsyncHandler(async (req, res) => {
        const data = new ClinicalReportSection(req.body);
        const record = await this.service.createSection(data.createSection);

        if (!record) {
            return res.status(500).json({ message: "Failed to create report section" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Clinical Report",
            action: `created report section ${record.id}`,
            reason: "Clinical report section management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Report section created successfully",
            status: "ok",
            data: record
        });
    });

    updateSection = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateSection(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update report section" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Clinical Report",
            action: `updated report section ${updated.id}`,
            reason: "Clinical report section management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Report section updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleSection = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSection(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch report section" });
        }

        return res.status(200).json({
            message: "Report section fetched successfully",
            status: "ok",
            data: record
        });
    });

    getSections = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getSections(req.params.clinicalReportId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch report sections" });
        }

        return res.status(200).json({
            message: "Report sections fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default ClinicalReportSectionController;
