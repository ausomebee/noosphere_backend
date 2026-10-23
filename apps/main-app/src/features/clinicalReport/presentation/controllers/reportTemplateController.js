import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportTemplateRepository from "../../infrastructure/reportTemplateRepository.js";
import ClinicalReportTemplateSectionRepository from "../../infrastructure/reportTemplateSectionRepository.js";
import ClinicalReportTemplateService from "../../application/reportTemplateService.js";
import ClinicalReportTemplateSectionService from "../../application/reportTemplateSectionService.js";
import ClinicalReportTemplate from "../../domain/reportTemplate.js";
import ClinicalReportTemplateSection from "../../domain/reportTemplateSection.js";

class ClinicalReportTemplateController {
    constructor() {
        this.prisma = prismaService.getClient();

        const templateRepository = new ClinicalReportTemplateRepository(
            this.prisma.clinicalReportTemplates
        );

        const sectionRepository = new ClinicalReportTemplateSectionRepository(
            this.prisma.clinicalReportTemplateSection
        );

        this.templateService = new ClinicalReportTemplateService({
            clinicalReportTemplateRepository: templateRepository
        });

        this.sectionService = new ClinicalReportTemplateSectionService({
            repository: sectionRepository
        });
    }

    createTemplate = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const templateData = new ClinicalReportTemplate(data);
        const template = await this.templateService.createTemplate(
            templateData.createTemplate
        );

        for (const section of data.sections || []) {
            const sectionData = new ClinicalReportTemplateSection({
                ...section,
                templateId: template.id
            });

            await this.sectionService.createSection(
                sectionData.createSection
            );
        }

        return res.status(201).json({
            status: "ok",
            message: "Clinical report template created successfully",
            data: template
        });
    });

    updateTemplate = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const templateData = new ClinicalReportTemplate(data);
        const updatedTemplate = await this.templateService.updateTemplate(
            templateData
        );

        for (const section of data.sections || []) {
            if (section.id) {
                const sectionData = new ClinicalReportTemplateSection(section);
                await this.sectionService.updateSection(sectionData);
            } else {
                const sectionData = new ClinicalReportTemplateSection({
                    ...section,
                    templateId: data.id
                });

                await this.sectionService.createSection(
                    sectionData.createSection
                );
            }
        }

        return res.status(200).json({
            status: "ok",
            message: "Clinical report template updated successfully",
            data: updatedTemplate
        });
    });

    getSingleTemplate = expressAsyncHandler(async (req, res) => {
        const template = await this.templateService.getTemplate(req.params.id);

        const sections = await this.sectionService.getSections(template.id);

        return res.status(200).json({
            status: "ok",
            message: "Template fetched successfully",
            data: { ...template, sections }
        });
    });

    duplicateTemplate = expressAsyncHandler(async (req, res) => {
        const template = await this.templateService.getTemplate(req.params.id);
        const sections = await this.sectionService.getSections(template.id);

        const templateData = new ClinicalReportTemplate({
            ...template,
            title: `${template.title} copy`
        });

        const newTemplate = await this.templateService.createTemplate(
            templateData.createTemplate
        );

        for (const section of sections) {
            const sectionData = new ClinicalReportTemplateSection({
                ...section,
                templateId: newTemplate.id
            });

            await this.sectionService.createSection(
                sectionData.createSection
            );
        }

        return res.status(200).json({
            status: "ok",
            message: "Template duplicated successfully",
            data: newTemplate
        });
    });

    getTenantTemplates = expressAsyncHandler(async (req, res) => {
        const templates = await this.templateService.getTemplates(
            req.params.tenantId
        );

        return res.status(200).json({
            status: "ok",
            message: "Templates fetched successfully",
            data: templates
        });
    });

    deleteTemplate = expressAsyncHandler(async (req, res) => {
        const updated = await this.templateService.updateTemplate(
            { id: req.params.id, isDeleted: true }
        );

        return res.status(200).json({
            status: "ok",
            message: "Clinical template deleted successfully",
            data: updated
        });
    });
}

export default ClinicalReportTemplateController;
