import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportVersionService from "../../application/clinicalReportVersionService.js";
import ClinicalReportVersionRepository from "../../infrastructure/clinicalReportVersionRepository.js";
import ClinicalReportVersion from "../../domain/clinicalReportVersion.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class ClinicalReportVersionController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new ClinicalReportVersionRepository(
            this.prisma.clinicalReportVersion
        );

        this.service = new ClinicalReportVersionService({
            repository: this.repository
        });
    }

    createVersion = expressAsyncHandler(async (req, res) => {
        const data = new ClinicalReportVersion(req.body);

        const record = await this.service.createVersion(data.createVersion);

        if (!record) {
            return res.status(500).json({ message: "Failed to create report version" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Clinical Report",
            action: `created report version ${record.id}`,
            reason: "Clinical report version management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Report version created successfully",
            status: "ok",
            data: record
        });
    });

    getSingleVersion = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getVersion(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch report version" });
        }

        return res.status(200).json({
            message: "Report version fetched successfully",
            status: "ok",
            data: record
        });
    });

    getReportVersions = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getVersionsByReport(
            req.params.clinicalReportId
        );

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch report versions" });
        }

        return res.status(200).json({
            message: "Report versions fetched successfully",
            status: "ok",
            data: records
        });
    });

    getLatestVersion = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getLatestVersion(
            req.params.clinicalReportId
        );

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch latest report version" });
        }

        return res.status(200).json({
            message: "Latest report version fetched successfully",
            status: "ok",
            data: record
        });
    });

    rollbackVersion = expressAsyncHandler(async (req, res) => {
        const record = await this.service.rollbackVersion(req.params.versionId);

        if (!record) {
            return res.status(500).json({ message: "Failed to rollback report version" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Clinical Report",
            action: `rolled back report version ${req.params.versionId}`,
            reason: "Clinical report version management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Report version rolled back successfully",
            status: "ok",
            data: record
        });
    });
}

export default ClinicalReportVersionController;
