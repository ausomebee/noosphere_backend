import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportService from "../../application/reportService.js";
import ClinicalReportRepository from "../../infrastructure/reportRepository.js";
import ClinicalReportSectionService from "../../application/reportSectionService.js";
import ClinicalReportSectionRepository from "../../infrastructure/reportSectionRepository.js";
import ClinicalReportHistoryService from "../../application/reportHistoryService.js";
import ClinicalReportHistoryRepository from "../../infrastructure/reportHistoryRepository.js";
import ClinicalReport from "../../domain/report.js";
import ClinicalReportSection from "../../domain/reportSection.js";
import ClinicalReportHistory from "../../domain/reportHistory.js";
import { is } from "date-fns/locale";

class ClinicalReportController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.reportService = new ClinicalReportService({
            repository: new ClinicalReportRepository(this.prisma.clinicalReport)
        });

        this.sectionService = new ClinicalReportSectionService({
            repository: new ClinicalReportSectionRepository(
                this.prisma.clinicalReportSection
            )
        });

        this.historyService = new ClinicalReportHistoryService({
            repository: new ClinicalReportHistoryRepository(
                this.prisma.clinicalReportHistory
            )
        });
    }

    createReport = expressAsyncHandler(async (req, res) => {
        const reportData = new ClinicalReport(req.body);
        const report = await this.reportService.createReport(
            reportData.createReport
        );

        for (const section of req.body.sections || []) {
            const sectionData = new ClinicalReportSection({
                ...section,
                clinicalReportId: report.id
            });

            await this.sectionService.createSection(
                sectionData.createSection
            );
        }

        const history = new ClinicalReportHistory({
            clinicalReportId: report.id,
            action: "CREATED",
            createdBy: report.creatorId
        });

        await this.historyService.createHistory(history.createHistory);

        return res.status(201).json({
            status: "ok",
            message: "Clinical report created successfully",
            data: report
        });
    });

    updateReport = expressAsyncHandler(async (req, res) => {
        const reportData = new ClinicalReport(req.body);
        const updated = await this.reportService.updateReport(reportData);

        for (const section of req.body.sections || []) {
            if (section.id) {
                await this.sectionService.updateSection(section);
            } else {
                const sectionData = new ClinicalReportSection({
                    ...section,
                    clinicalReportId: req.body.id
                });

                await this.sectionService.createSection(
                    sectionData.createSection
                );
            }
        }

        return res.status(200).json({
            status: "ok",
            message: "Clinical report updated successfully",
            data: updated
        });
    });

    deleteReport = expressAsyncHandler(async (req, res) => {
        const updated = await this.reportService.updateReport(
            { id: req.params.id, isDeleted: true }
        );

        return res.status(200).json({
            status: "ok",
            message: "Clinical report updated successfully",
            data: updated
        });
    });

    updateReportStatus = expressAsyncHandler(async (req, res) => {
        const updated = await this.reportService.updateReport(
            { id: req.params.id, status: req.query.status }
        );

        return res.status(200).json({
            status: "ok",
            message: "Clinical report updated successfully",
            data: updated
        });
    });

    getSingleReport = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReport(req.params.id);
        const sections = await this.sectionService.getSections(report.id);
        const history = await this.historyService.getHistories(report.id);

        return res.status(200).json({
            status: "ok",
            message: "Clinical report fetched successfully",
            data: { ...report, sections, history }
        });
    });

    getReportsByStatus = expressAsyncHandler(async (req, res) => {
        const reports = await this.reportService.getReportsByStatus(
            req.params.tenantId,
            req.query.status
        );

        return res.status(200).json({
            status: "ok",
            message: "Clinical reports fetched successfully",
            data: reports
        });
    });

    getTenantReports = expressAsyncHandler(async (req, res) => {
        const reports = await this.reportService.getReports(
            req.params.tenantId
        );

        return res.status(200).json({
            status: "ok",
            message: "Clinical reports fetched successfully",
            data: reports
        });
    });

    duplicateReport = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReport(req.params.id);
        const sections = await this.sectionService.getSections(report.id);

        const reportData = new ClinicalReport({
            ...report,
            title: `${report.title} copy`
        });

        const newReport = await this.reportService.createReport(
            reportData.createReport
        );

        for (const section of sections) {
            const sectionData = new ClinicalReportSection({
                ...section,
                reportId: newReport.id
            });

            await this.sectionService.createSection(
                sectionData.createSection
            );
        }

        return res.status(200).json({
            status: "ok",
            message: "Report duplicated successfully",
            data: newReport
        });
    });
}

export default ClinicalReportController;
