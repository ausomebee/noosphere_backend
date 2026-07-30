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
import TokenService from "../../../../utilities/generate_token.js";
import ClinicalReportPdfGenerator from "../../../../utilities/clinicalReportGenerator.js";
import ClinicalReportVersionRepository from "../../infrastructure/clinicalReportVersionRepository.js";
import ClinicalReportVersionService from "../../application/clinicalReportVersionService.js";
import S3Service from "../../../../utilities/s3.js";
import ClinicalReportVersion from "../../domain/clinicalReportVersion.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";
import ClientNotificationEmitter from "../../../client/application/clientNotificationEmitter.js";

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

        this.versionRepository = new ClinicalReportVersionRepository(
            this.prisma.clinicalReportVersion
        );

        this.versionService = new ClinicalReportVersionService({
            repository: this.versionRepository
        });

        this.notificationService = new NotificationService({
            notificationRepository: new NotificationsRepository(this.prisma.notification),
        });
        this.clientNotificationEmitter = new ClientNotificationEmitter({
            prisma: this.prisma,
            notificationService: this.notificationService,
        });

        this.token = TokenService;
        this.pdfGenerator = new ClinicalReportPdfGenerator();
        this.s3Service = new S3Service();
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

    validateReportToken = expressAsyncHandler(async (req, res) => {
        const { token } = req.params;

        const decoded = await this.token.validateClinicalReportToken(
            token,
            this.prisma
        );

        const report = await this.reportService.getReport(decoded.id);

        if (!report) {
            return res.status(404).json({
                status: "error",
                message: "Clinical report not found"
            });
        }

        return res.status(200).json({
            status: "ok",
            message: "Clinical report fetched successfully",
            data: report
        });
    });

    withdrawReportToken = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;

        await this.token.withdrawClinicalReportToken(id, this.prisma);

        return res.status(200).json({
            status: "ok",
            message: "Clinical report token withdrawn successfully"
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

    submitSignature = expressAsyncHandler(async (req, res) => {
        try {
            const section = await this.sectionService.updateSection(req.body);

            const report = await this.reportService.getReportForExport(section.clinicalReportId);

            const updated = await this.reportService.updateReport({
                id: report.id,
                status: "SIGNED"
            });

            const pdfBuffer = await this.pdfGenerator.generatePdf({
                report,
                sections: report.clinicalReportSections
            });

            const viewLink = await this.buildSignatureLink(report);

            const html = templateRenderer.render('clinical-report-signed.html', {
                firstName: report.client.client.firstName,
                title: report.title,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                viewToken: viewLink,
                companyName: report.tenant.companyName
            });

            const emailText = `
                Clinical Report Ready

                Dear ${report.client.client.firstName},

                Your clinical report has been completed and signed. Please find the attached PDF document.

                You can also view your report online at: ${viewLink}

                Report Details:
                - Title: ${report.title}
                - Date: ${new Date().toLocaleDateString()}
                - Status: Signed

                This email was sent by ${report.tenant.companyName}.
                If you have any questions, please contact us.
            `.trim();

            const sendMail = await emailService.sendTenantEmailWithAttachment({
                tenantSlug: report.tenant.subdomain,
                to: [report.client.client.email],
                subject: `Your Clinical Report - ${report.title}`,
                text: emailText,
                html: html,
                attachmentBuffer: pdfBuffer,
                attachmentName: `${this.sanitizeFilename(report.title)}.pdf`,
                replyTo: report.tenant.email
            });

            if (!sendMail.messageId) {
                throw new Error("Failed to send email - no message ID returned");
            }

            const s3Key = `clinical-reports/${report.id}/${this.sanitizeFilename(report.title)}.pdf`;
            const url = await this.s3Service.uploadBuffer(s3Key, pdfBuffer);

            const data = new ClinicalReportVersion({
                clinicalReportId: report.id,
                url: url
            });

            const record = await this.versionService.createVersion(data.createVersion);

            if (!record) {
                return res.status(500).json({ message: "Failed to create report version" });
            }

            return res.status(200).json({
                status: "ok",
                message: "Clinical report signed and sent successfully",
                data: {
                    reportId: report.id,
                    messageId: sendMail.messageId,
                    sentTo: report.client.client.email,
                    sentAt: new Date().toISOString()
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to process signature and send report",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    sanitizeFilename(filename) {
        return filename
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase();
    }

    async buildSignatureLink(report) {
        const token = await this.token.generateClinicalReportToken(report.id, this.prisma);
        const tenantClientUrl = templateRenderer.buildTenantClientUrl(report.tenant.subdomain);

        return `${tenantClientUrl}/tenant/report/client-view/${token}`;
    }

    async emitSignatureRequestedNotification(report, signatureLink) {
        return this.clientNotificationEmitter.emit({
            clientId: report.client.client.id,
            tenantId: report.tenant.id,
            type: NotificationType.SIGNATURE_REQUESTED,
            title: "Signature Requested",
            content: "A clinical report is ready for your review and signature.",
            entityType: NotificationEntityType.CLINICAL_REPORT,
            entityId: report.id,
            metadata: {
                reportTitle: report.title,
                signatureLink,
            },
        });
    }

    previewPdf = expressAsyncHandler(async (req, res) => {
        const { reportId } = req.params;

        const report = await this.reportService.getReportForExport(reportId);

        const pdfBuffer = await this.pdfGenerator.generatePdf({
            report,
            sections: report.clinicalReportSections
        });

        res.contentType('application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${this.sanitizeFilename(report.title)}.pdf"`);
        res.send(pdfBuffer);
    });

    downloadPdf = expressAsyncHandler(async (req, res) => {
        const { reportId } = req.params;

        const report = await this.reportService.getReportForExport(reportId);

        const pdfBuffer = await this.pdfGenerator.generatePdf({
            report,
            sections: report.clinicalReportSections
        });

        res.contentType('application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${this.sanitizeFilename(report.title)}.pdf"`);
        res.send(pdfBuffer);
    });

    // submitSignature = expressAsyncHandler(async (req, res) => {
    //     const section = await this.sectionService.updateSection(req.body)

    //     const report = await this.reportService.getReportForExport(section.clinicalReportId); 

    //     const updated = await this.reportService.updateReport({ id: report.id, status: "SIGNED" });

    //     const pdfBuffer = await this.generateClinicalReportPdf({
    //         report,
    //         sections: report.clinicalReportSections
    //     });

    //     const sendMail = await emailService.sendTenantEmailWithAttachment({
    //         tenantSlug: report.tenant.subdomain,
    //         to: [report.client.client.email],
    //         subject: "Clinical Report",
    //         text: "Please find the attached clinical report.",
    //         html: `<p>Please find the attached clinical report.</p> ${await this.token.generateClinicalReportToken(report.id, this.prisma)}`,
    //         attachmentBuffer: pdfBuffer,
    //         attachmentName: "clinical-report.pdf"
    //     });

    //     if (!sendMail.messageId) {
    //         throw new Error("Failed to send mail");
    //     }

    //     return res.status(200).json({
    //         status: "ok",
    //         message: "Client nudged successfully"
    //     });
    // });

    resubmitForSignature = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReportForExport(req.params.id);

        const updated = await this.reportService.updateReport({ id: report.id, status: "AWAITING_SIGNATURE" });

        const createHistory = new ClinicalReportHistory({
            clinicalReportId: updated.id,
            action: updated.status,
            createdBy: updated.creatorId
        });
        await this.historyService.createHistory(createHistory);

        const signatureLink = await this.buildSignatureLink(report);
        await this.emitSignatureRequestedNotification(report, signatureLink);

        const html = templateRenderer.render('clinical-report-updated.html', {
            firstName: report.client.client.firstName,
            lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            companyName: report.tenant.companyName,
            signatureLink: signatureLink,
            tenantEmail: report.tenant.email
        });

        const sendMail = await emailService.sendTenantEmail({
            tenantSlug: report.tenant.subdomain,
            to: [report.client.client.email],
            subject: "Clinical Report",
            html: html
        });

        if (!sendMail.messageId) {
            throw new Error("Failed to send mail");
        }

        return res.status(200).json({
            status: "ok",
            message: "Report approved successfully"
        });
    });

    nudgeClient = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReportForExport(req.params.id);

        const signatureLink = await this.buildSignatureLink(report);
        await this.emitSignatureRequestedNotification(report, signatureLink);

        const html = templateRenderer.render('clinical-report-reminder.html', {
            firstName: report.client.client.firstName,
            dateSent: new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            companyName: report.tenant.companyName,
            signatureLink: signatureLink,
            tenantEmail: report.tenant.email
        });

        const sendMail = await emailService.sendTenantEmail({
            tenantSlug: report.tenant.subdomain,
            to: [report.client.client.email],
            subject: "Clinical Report",
            html: html
        });

        if (!sendMail.messageId) {
            throw new Error("Failed to send mail");
        }

        return res.status(200).json({
            status: "ok",
            message: "Client nudged successfully"
        });
    });

    approveClinicalReport = expressAsyncHandler(async (req, res) => {
        const report = await this.reportService.getReportForExport(req.params.id);

        const updated = await this.reportService.updateReport({ id: report.id, status: "AWAITING_SIGNATURE" });

        const createHistory = new ClinicalReportHistory({
            clinicalReportId: updated.id,
            action: updated.status,
            createdBy: updated.creatorId
        });
        await this.historyService.createHistory(createHistory);

        const signatureLink = await this.buildSignatureLink(report);
        await this.emitSignatureRequestedNotification(report, signatureLink);

        const html = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Clinical Report - Signature Required</title>
            <style type="text/css">
                body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                table { border-collapse: collapse !important; }
                
                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;">
                <tr>
                <td align="center" style="padding: 0;">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff;">
                    
                    <tr>
                        <td align="center" style="padding: 0; height: 60px; background: linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #EF4444 100%);">
                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:60px;">
                            <v:fill type="gradient" color="#8B5CF6" color2="#EF4444" angle="90" />
                        </v:rect>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                            <td align="center">
                                <img src="cid:unique@image" alt="NooSphere" width="180" height="40" style="display: block; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #000000;" />
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 0 40px 10px 40px;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #1a1a1a; line-height: 1.4;">
                            Hello ${report.client.client.firstName},<br/>Clinical Report Ready for Review
                        </h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px 40px;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #666666; font-weight: 400;">
                            Your clinical report is ready for your review and signature.<br/>
                            Please click the button below to access and sign your report.<br/>
                            This helps us proceed with your care plan efficiently.
                        </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 0 40px 30px 40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border-radius: 8px;">
                            <tr>
                            <td style="padding: 24px 24px 20px 24px;">
                                
                                <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                <strong style="font-weight: 600; color: #1a1a1a;">Report Details:</strong>
                                </p>
                                
                                <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #1a1a1a;">
                                <strong style="font-weight: 600;">Report Type:</strong> Clinical Report
                                </p>
                                
                                <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #1a1a1a;">
                                <strong style="font-weight: 600;">Date Prepared:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                
                                <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #1a1a1a;">
                                <strong style="font-weight: 600;">Provider:</strong> ${report.tenant.companyName}
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
                                    <tr>
                                    <td align="center" style="border-radius: 6px; background-color: #2563eb;">
                                        <a href="${signatureLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                        Review & Sign Report
                                        </a>
                                    </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.5; color: #666666;">
                                Or copy and paste this link into your browser:<br/>
                                <a href="${signatureLink}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${signatureLink}</a>
                                </p>
                                
                                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                Please review and sign the report within 7 days. If you have any questions or concerns about the report content, don't hesitate to reach out.
                                </p>
                                
                                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                If you need assistance, we're here to help at<br/>
                                <a href="mailto:${report.tenant.email}" style="color: #2563eb; text-decoration: none;">${report.tenant.email}</a>
                                </p>
                                <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                Best regards,
                                </p>
                                <p style="margin: 0 0 4px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                ${report.tenant.companyName} Team
                                </p>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    
                    </table>
                    
                </td>
                </tr>
            </table>

            </body>
            </html>
        `;

        const sendMail = await emailService.sendTenantEmail({
            tenantSlug: report.tenant.subdomain,
            to: [report.client.client.email],
            subject: "Clinical Report",
            html: html
        });

        if (!sendMail.messageId) {
            throw new Error("Failed to send mail");
        }

        return res.status(200).json({
            status: "ok",
            message: "Report approved successfully"
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

    getClientReportsByStatus = expressAsyncHandler(async (req, res) => {
        const reports = await this.reportService.getClientReportsByStatus(
            req.params.clientTenantId,
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
            req.params.approverId, req.params.clientTenantId
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
