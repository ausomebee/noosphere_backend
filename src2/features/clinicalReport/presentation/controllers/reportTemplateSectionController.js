import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportTemplateSectionRepository from "../../infrastructure/reportTemplateSectionRepository.js";
import ClinicalReportTemplateSectionService from "../../application/reportTemplateSectionService.js";

class ClinicalReportTemplateSectionController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new ClinicalReportTemplateSectionRepository(
            this.prisma.clinicalReportTemplateSection
        );

        this.service = new ClinicalReportTemplateSectionService({
            repository: this.repository
        });
    }

    createSection = expressAsyncHandler(async (req, res) => {
        const data = new ClinicalReportTemplateSection(req.body);
        const record = await this.service.createSection(data.createSection);

        if (!record) {
            return res.status(500).json({ message: "Failed to create template section" });
        }

        return res.status(201).json({
            message: "Template section created successfully",
            status: "ok",
            data: record
        });
    });

    updateSection = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateSection(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update template section" });
        }

        return res.status(200).json({
            message: "Template section updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleSection = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSection(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch template section" });
        }

        return res.status(200).json({
            message: "Template section fetched successfully",
            status: "ok",
            data: record
        });
    });

    getSections = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getSections(req.params.templateId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch template sections" });
        }

        return res.status(200).json({
            message: "Template sections fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default ClinicalReportTemplateSectionController;
