import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import OrganizationDiagnosisCodesRepository from "../../infrastucture/diagnosisCodeRepository.js";
import OrganizationDiagnosisCodesService from "../../application/diagnosisCodeService.js";
import OrganizationDiagnosisCode from "../../domain/diagnosisCode.js";

class OrganizationDiagnosisCodesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new OrganizationDiagnosisCodesRepository(this.prisma.organizationDiagnosisCodes);
        this.service = new OrganizationDiagnosisCodesService({ organizationDiagnosisCodesRepository: this.repository });
    }

    createDiagnosisCode = expressAsyncHandler(async (req, res) => {
        const codeData = new OrganizationDiagnosisCode(req.body);
        const code = await this.service.createOrganizationDiagnosisCode(codeData.createOrganizationDiagnosisCodes);

        if (!code) {
            res.status(500).json({ message: "Failed to create diagnosis code" });
        }

        return res.status(201).json({
            message: "Diagnosis code created successfully",
            status: "ok",
            data: code,
        });
    });

    updateDiagnosisCode = expressAsyncHandler(async (req, res) => {
        const code = await this.service.updateOrganizationDiagnosisCode(req.body);

        if (!code) {
            res.status(500).json({ message: "Failed to update diagnosis code" });
        }

        return res.status(201).json({
            message: "Diagnosis code updated successfully",
            status: "ok",
            data: code,
        });
    });

    getSingleDiagnosisCode = expressAsyncHandler(async (req, res) => {
        const code = await this.service.getOrganizationDiagnosisCode(req.params.id);

        if (!code) {
            res.status(500).json({ message: "Failed to fetch diagnosis code" });
        }

        return res.status(200).json({
            message: "Diagnosis code fetched successfully",
            status: "ok",
            data: code,
        });
    });

    getTenantDiagnosisCodes = expressAsyncHandler(async (req, res) => {
        const codes = await this.service.getTenantDiagnosisCodes(req.params.tenantId);

        if (!codes) {
            res.status(500).json({ message: "Failed to fetch diagnosis codes" });
        }

        return res.status(200).json({
            message: "Diagnosis codes fetched successfully",
            status: "ok",
            data: codes,
        });
    });

    deactivateDiagnosisCode = expressAsyncHandler(async (req, res) => {
        const code = await this.service.updateOrganizationDiagnosisCode({ id: req.params.id, isActive: req.params.active === "true" });

        if (!code) {
            res.status(500).json({ message: "Failed to deactivate diagnosis code" });
        }

        return res.status(200).json({
            message: "Diagnosis code deactivated successfully",
            status: "ok",
            data: code,
        });
    });
}

export default OrganizationDiagnosisCodesController;
