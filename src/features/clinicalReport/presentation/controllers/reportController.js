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

                const pageWidth = 595.28; // A4 width in points
                const leftMargin = 50;
                const rightMargin = 50;

                /* ---------- HEADER ---------- */
                // "Confidential" text
                doc
                    .fontSize(11)
                    .fillColor("#999999")
                    .font("Helvetica")
                    .text("Confidential", leftMargin, 50, {
                        align: "center",
                        width: pageWidth - leftMargin - rightMargin
                    });

                doc.moveDown(1.5);

                // Client Name (left side)
                const clientNameY = doc.y;
                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica")
                    .text(`Client Name `, leftMargin, clientNameY, { continued: true })
                    .font("Helvetica-Bold")
                    .text("report.clientName");

                // Tenant Company info (right side) - align from the right
                const rightColumnX = pageWidth - rightMargin - 200;

                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Tenant Company", rightColumnX, clientNameY, {
                        width: 200,
                        align: "right"
                    });

                doc
                    .fontSize(9)
                    .fillColor("#888888")
                    .font("Helvetica")
                    .text("email@gmail.com", rightColumnX, doc.y + 2, {
                        width: 200,
                        align: "right"
                    });

                doc
                    .fontSize(9)
                    .fillColor("#888888")
                    .text("+441 344 36849", rightColumnX, doc.y + 2, {
                        width: 200,
                        align: "right"
                    });

                doc
                    .fontSize(9)
                    .fillColor("#888888")
                    .text("304 Sharafa Street, Benz, Texas, US, 94562", rightColumnX, doc.y + 2, {
                        width: 200,
                        align: "right"
                    });

                doc.moveDown(3);

                /* ---------- TITLE ---------- */
                doc
                    .fontSize(24)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Document Title", leftMargin, doc.y, {
                        align: "center",
                        width: pageWidth - leftMargin - rightMargin
                    });

                doc.moveDown(2.5);

                /* ---------- SECTION HEADER ---------- */
                doc
                    .fontSize(13)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("SECTION HEADER", leftMargin, doc.y);

                doc.moveDown(1);

                /* ---------- CLIENT DETAILS ---------- */
                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Input Label (Client Name): ", leftMargin, doc.y, { continued: true })
                    .font("Helvetica")
                    .fillColor("#333333")
                    .text(`Body Text (${"report.childName"})`);

                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Date of Birth: ", leftMargin, doc.y + 4, { continued: true })
                    .font("Helvetica")
                    .fillColor("#333333")
                    .text("report.dob");

                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Gender: ", leftMargin, doc.y + 4, { continued: true })
                    .font("Helvetica")
                    .fillColor("#333333")
                    .text("report.gender");

                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Client age: ", leftMargin, doc.y + 4, { continued: true })
                    .font("Helvetica")
                    .fillColor("#333333")
                    .text("report.age");

                doc.moveDown(1.5);

                /* ---------- CLIENT BACKGROUND ---------- */
                doc
                    .fontSize(11)
                    .fillColor("#000000")
                    .font("Helvetica-Bold")
                    .text("Client background:", leftMargin, doc.y);

                doc
                    .fontSize(11)
                    .fillColor("#4a4a4a")
                    .font("Helvetica")
                    .text("report.background", leftMargin, doc.y + 4, {
                        width: pageWidth - leftMargin - rightMargin,
                        align: "justify",
                        lineGap: 2
                    });

                doc.moveDown(2.5);

                /* ---------- DIAGNOSES ---------- */
                sections.forEach((section, index) => {
                    // Diagnosis name
                    doc
                        .fontSize(11)
                        .fillColor("#000000")
                        .font("Helvetica-Bold")
                        .text("Diagnosis name: ", leftMargin, doc.y, { continued: true })
                        .font("Helvetica")
                        .fillColor("#333333")
                        .text("section.name");

                    // Diagnosis Code
                    doc
                        .fontSize(11)
                        .fillColor("#000000")
                        .font("Helvetica-Bold")
                        .text("Diagnosis Code: ", leftMargin, doc.y + 4, { continued: true })
                        .font("Helvetica")
                        .fillColor("#333333")
                        .text("section.code");

                    // Diagnosis Description
                    doc
                        .fontSize(11)
                        .fillColor("#000000")
                        .font("Helvetica-Bold")
                        .text("Diagnosis Description: ", leftMargin, doc.y + 4, { continued: false });

                    doc
                        .fontSize(11)
                        .fillColor("#4a4a4a")
                        .font("Helvetica")
                        .text(section.description, leftMargin, doc.y, {
                            width: pageWidth - leftMargin - rightMargin,
                            align: "justify",
                            lineGap: 2
                        });

                    // Optional fields
                    if (section.diagnosisDate) {
                        doc
                            .fontSize(11)
                            .fillColor("#000000")
                            .font("Helvetica-Bold")
                            .text("Diagnosis date: ", leftMargin, doc.y + 4, { continued: true })
                            .font("Helvetica")
                            .fillColor("#333333")
                            .text(section.diagnosisDate);
                    }

                    if (section.diagnosedBy) {
                        doc
                            .fontSize(11)
                            .fillColor("#000000")
                            .font("Helvetica-Bold")
                            .text("Diagnosed by: ", leftMargin, doc.y + 4, { continued: true })
                            .font("Helvetica")
                            .fillColor("#333333")
                            .text(section.diagnosedBy);
                    }

                    if (section.primaryDiagnosis !== undefined) {
                        doc
                            .fontSize(11)
                            .fillColor("#000000")
                            .font("Helvetica-Bold")
                            .text("Primary diagnosis: ", leftMargin, doc.y + 4, { continued: true })
                            .font("Helvetica")
                            .fillColor("#333333")
                            .text(section.primaryDiagnosis ? "Yes" : "No");
                    }

                    // Spacing between diagnosis sections
                    if (index < sections.length - 1) {
                        doc.moveDown(2);
                    }
                });

                /* ---------- FOOTER ---------- */
                // Position footer at bottom of page
                const footerY = 780; // Near bottom of A4 page

                doc
                    .fontSize(9)
                    .fillColor("#777777")
                    .font("Helvetica")
                    .text(
                        "This document was created using ",
                        leftMargin,
                        footerY,
                        {
                            continued: true,
                            width: pageWidth - leftMargin - rightMargin,
                            align: "center"
                        }
                    )
                    .fillColor("#0066cc")
                    .font("Helvetica-Bold")
                    .text("NooSphere ABA PMS", { continued: true })
                    .fillColor("#777777")
                    .font("Helvetica")
                    .text(". Visit ", { continued: true })
                    .fillColor("#0066cc")
                    .font("Helvetica-Bold")
                    .text("www.noospherehub.net", { continued: true })
                    .fillColor("#777777")
                    .font("Helvetica")
                    .text(" to get started");

                // Page number in bottom right
                doc
                    .fontSize(9)
                    .fillColor("#999999")
                    .font("Helvetica")
                    .text("01", pageWidth - rightMargin - 30, footerY, {
                        width: 30,
                        align: "right"
                    });

                doc.end();
            } catch (err) {
                reject(err);
            }
        });
    }

    nudgeClient = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReportForExport(req.params.id);

        const pdfBuffer = await this.generateClinicalReportPdf({
            report,
            sections: report.clinicalReportSections
        });

        const sendMail = await emailService.sendTenantEmailWithAttachment({
            tenantSlug: report.tenant.subdomain,
            to: [report.client.client.email],
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
