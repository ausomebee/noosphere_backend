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
import PDFDocument from "pdfkit";
import emailService from "../../../../utilities/ses.js";

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

        const createHistory = new ClinicalReportHistory({
            clinicalReportId: report.id,
            action: "CREATED",
            createdBy: report.creatorId
        });
        await this.historyService.createHistory(createHistory);

        if (report.status === "SUBMITTED") {
            const submittedHistory = new ClinicalReportHistory({
                clinicalReportId: report.id,
                action: "SUBMITTED",
                createdBy: report.creatorId
            });
            await this.historyService.createHistory(submittedHistory);
        }

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

        const history = new ClinicalReportHistory({
            clinicalReportId: updated.id,
            action: "EDITED",
            createdBy: updated.creatorId
        });
        await this.historyService.createHistory(history);

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

        const history = new ClinicalReportHistory({
            clinicalReportId: updated.id,
            action: updated.status,
            createdBy: updated.creatorId
        });
        await this.historyService.createHistory(history);

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


    async generateClinicalReportPdf({ report, sections }) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: "A4",
                    margin: 50
                });

                const buffers = [];
                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => resolve(Buffer.concat(buffers)));

                /* ---------- HEADER ---------- */
                doc
                    .fontSize(10)
                    .fillColor("#777")
                    .text("Confidential", { align: "center" })
                    .moveDown(1);

                doc
                    .fontSize(11)
                    .fillColor("#000")
                    .text(`Client Name: ${"report.clientName"}`, { continued: true })
                    .text("        ", { continued: true })
                    .text("Tenant Company", { align: "right" });

                doc
                    .fontSize(9)
                    .fillColor("#555")
                    .text("email@gmail.com | +441 344 36849", { align: "right" })
                    .text("304 Sharafa Street, Benz, Texas, US, 94562", {
                        align: "right"
                    });

                doc.moveDown(2);

                /* ---------- TITLE ---------- */
                doc
                    .fontSize(18)
                    .fillColor("#222")
                    .text("Document Title", { align: "center" });

                doc.moveDown(2);

                /* ---------- SECTION ---------- */
                doc
                    .fontSize(12)
                    .fillColor("#000")
                    .text("SECTION HEADER", { underline: true });

                doc.moveDown(1);

                doc.fontSize(11).fillColor("#000");
                doc.text(`Client Name: ${"report.childName"}`);
                doc.text(`Date of Birth: ${"report.dob"}`);
                doc.text(`Gender: ${"report.gender"}`);
                doc.text(`Client age: ${"report.age"}`);

                doc.moveDown(1);

                doc.font("Helvetica-Bold").text("Client background:");
                doc
                    .font("Helvetica")
                    .fillColor("#444")
                    .text("report.background", {
                        lineGap: 4
                    });

                doc.moveDown(2);

                /* ---------- DIAGNOSIS ---------- */
                sections.forEach((section) => {
                    doc
                        .font("Helvetica-Bold")
                        .fillColor("#000")
                        .text(`Diagnosis name: `, { continued: true })
                        .font("Helvetica")
                        .text("section.name");

                    doc.font("Helvetica-Bold").text("Diagnosis Code: ", {
                        continued: true
                    });
                    doc.font("Helvetica").text("section.code");

                    doc.font("Helvetica-Bold").text("Diagnosis Description:");
                    doc
                        .font("Helvetica")
                        .fillColor("#444")
                        .text("section.description", { lineGap: 4 });

                    doc.moveDown(1);
                });

                /* ---------- FOOTER ---------- */
                doc.moveDown(3);
                doc
                    .fontSize(9)
                    .fillColor("#777")
                    .text(
                        "This document was created using NooSphere ABA PMS. Visit www.noospherehub.net to get started",
                        { align: "center" }
                    );

                doc.end();
            } catch (err) {
                reject(err);
            }
        });
    };

    nudgeClient = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReportForExport(req.params.id);

        const pdfBuffer = await this.generateClinicalReportPdf({
            report,
            sections: report.clinicalReportSections
        });

        const sendMail = await emailService.sendTenantEmailWithAttachment({
            tenantSlug: report.tenant.subdomain,
            to: ["ayodejiamzat@gmail.com"],
            subject: "Clinical Report",
            text: "Please find the attached clinical report.",
            html: "<p>Please find the attached clinical report.</p>",
            attachmentBuffer: pdfBuffer,
            attachmentName: "clinical-report.pdf"
        });

        if (!sendMail.messageId) {
            throw new Error("Failed to send mail");
        }

        return res.status(200).json({
            status: "ok",
            message: "Client nudged successfully"
        });
    });

    getReportsByStatus = expressAsyncHandler(async (req, res) => {
        const reports = await this.reportService.getReportsByStatus(
            req.params.tenantId,
            req.params.status
        );

        return res.status(200).json({
            status: "ok",
            message: "Clinical reports fetched successfully",
            data: reports
        });
    });

    getReportsSubmittedForApprover = expressAsyncHandler(async (req, res) => {
        const reports = await this.reportService.getReportsSubmittedForApprover(
            req.params.approverId
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
