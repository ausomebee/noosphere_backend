import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import IssueRepository from "../../infrastructure/issueRepository.js";
import IssueCommentRepository from "../../infrastructure/issueCommentRepository.js";
import IssueService from "../../application/issueService.js";
import LogsService from "../../../logs/application/logsService.js";
import LogsRepository from "../../../logs/infrastructure/logsRepository.js";
import Issue from "../../domain/issue.js";
import AdminService from "../../../admin/application/adminService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import SocketService from "../../../../config/socket.js";

class IssueController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.issueRepository = new IssueRepository(this.prisma.issue);
        this.issueCommentRepository = new IssueCommentRepository(this.prisma.issueComment);
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.service = new IssueService({ issueRepository: this.issueRepository, issueCommentRepository: this.issueCommentRepository });
        this.logService = new LogsService({ logsRepository: this.logsRepository });
        this.adminService = new AdminService();
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
    }

    createIssue = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            attachments: [
                {
                    key: req.file.key,
                    location: req.file.location
                }
            ]
        } : req.body
        const issue = await this.service.createIssue(data);


        if (!issue) {
            res.status(500).json({ message: 'Failed to create issue' });
        }

        const superAdmin = await this.adminService.getSuperAdmin();
        if (!superAdmin) {
            res.status(500).json({ message: 'Failed to fetch super admin.' });
        }

        const notif = await this.notificationService.createNotification({
            userId: superAdmin.id,
            userType: "ADMIN",
            type: "Issue Submitted",
            title: "Issue Submitted",
            content: `
                A support request has been submitted. Click here to view details        
            `,
            isRead: false
        });

        SocketService.emitToUser(notif.userId, notif.userType, "Issue Submitted", notif);

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "Logowrap/png",
            }
        ]

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Support Ticket Received – #${data.ticketId}</title>
                <style>
                    body, table, td, p, a {
                        margin: 0; padding: 0; border: 0;
                        font-size: 100%; font: inherit; vertical-align: baseline;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6; color: #333333;
                        background-color: #f5f5f5; margin: 0; padding: 20px;
                    }
                    .email-container {
                        max-width: 600px; margin: 0 auto;
                        background-color: #ffffff; border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;
                    }
                    .email-content { padding: 40px 30px; }
                    .logo-container { margin-bottom: 30px; text-align: center; }
                    .logo {
                        display: inline-flex; align-items: center;
                        font-size: 40px; font-weight: 600;
                        color: #000000; text-decoration: none;
                    }
                    .ticket-badge {
                        display: inline-block;
                        background-color: #EFF8FF;
                        color: #004ABA;
                        border: 1px solid #99C2FF;
                        border-radius: 20px;
                        padding: 6px 18px;
                        font-size: 14px; font-weight: 600;
                        margin-bottom: 20px;
                    }
                    .greeting { font-size: 16px; color: #333333; margin-bottom: 8px; }
                    .intro-text { font-size: 16px; color: #475467; margin-bottom: 30px; }
                    .section-title {
                        font-size: 18px; font-weight: 600;
                        color: #004ABA; margin-bottom: 16px;
                        padding-bottom: 10px; border-bottom: 1px solid #E0E0E0;
                    }
                    .billing-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .billing-table tr { border-bottom: 1px solid #F2F4F7; }
                    .billing-table tr:last-child { border-bottom: none; }
                    .billing-table td { padding: 12px 0; font-size: 15px; }
                    .billing-label { color: #475467; width: 50%; }
                    .billing-value { color: #101828; font-weight: 500; text-align: right; }
                    .billing-value.ticket-id { color: #004ABA; font-weight: 600; }
                    .priority-high { color: #B42318; font-weight: 600; }
                    .priority-medium { color: #B54708; font-weight: 600; }
                    .priority-low { color: #027A48; font-weight: 600; }
                    .info-box {
                        background-color: #E3F2FD;
                        border-radius: 8px; padding: 16px 20px; margin: 25px 0;
                        border: 1px solid #99C2FF; font-size: 15px; color: #475467;
                    }
                    .support-text { font-size: 15px; color: #475467; margin-bottom: 25px; }
                    .divider { border: none; border-top: 1px solid #E0E0E0; margin: 25px 0; }
                    .closing-text { font-size: 15px; color: #475467; margin-bottom: 20px; }
                    .footer { margin-top: 20px; }
                    .footer-text { color: #1976D2; font-size: 16px; margin-bottom: 5px; }
                    .team-signature { color: #1976D2; font-size: 16px; font-weight: 600; }
                    @media only screen and (max-width: 600px) {
                        .email-container { margin: 0; border-radius: 0; }
                        .email-content { padding: 30px 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-content">

                        <div class="logo-container">
                            <div class="logo">
                                <img src="cid:unique@image" alt="NooSphere" srcset="">
                            </div>
                        </div>

                        <div style="text-align: center;">
                            <span class="ticket-badge">Ticket #${data.ticketId} Received</span>
                        </div>

                        <p class="greeting">Hello ${data.tenantName},</p>
                        <p class="intro-text">
                            Your support request has been successfully submitted. Our team will review it shortly.
                        </p>

                        <p class="section-title">Ticket Details</p>

                        <table class="billing-table">
                            <tr>
                                <td class="billing-label">Ticket ID</td>
                                <td class="billing-value ticket-id">#${data.ticketId}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Subject</td>
                                <td class="billing-value">${data.subject}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Category</td>
                                <td class="billing-value">${data.category}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Priority</td>
                                <td class="billing-value priority-${data.priority.toLowerCase()}">${data.priority}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Submitted On</td>
                                <td class="billing-value">${data.submittedOn}</td>
                            </tr>
                        </table>

                        <div class="info-box">
                            You can track the progress of your request from your support portal.
                        </div>

                        <p class="support-text">
                            Our support team will update you as soon as we begin working on the issue.
                        </p>

                        <hr class="divider">

                        <div class="footer">
                            <p class="footer-text">Best regards,</p>
                            <p class="team-signature">NooSphere Support Team</p>
                        </div>

                    </div>
                </div>
            </body>
            </html>
        `;

        const sendMail = await MailService.sendMail(tenant.email, "Issue Submitted", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return res.status(201).json({
            message: "Issue created successfully",
            status: 'ok',
            data: issue
        });
    });

    getSingleIssue = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getSingleIssue(req.params.id);

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue' });
        }

        return res.status(201).json({
            message: "Issue fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getTenantIssueByStatus = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getTenantIssueByStatus(req.params.tenantId, req.params.status);

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issues' });
        }

        return res.status(201).json({
            message: "Issues fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    tenantManagementOverview = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.tenantManagementOverview(req.params.tenantId);

        if (!issue) {
            res.status(500).json({ message: 'Failed to get tenant management overview' });
        }

        return res.status(201).json({
            message: "Tenant management overview fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getTenantIssues = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getTenantIssues(req.params.tenantId);

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue' });
        }

        return res.status(201).json({
            message: "Issue fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getTenantIssuesOverview = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getTenantIssuesOverview(req.params.tenantId);

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue' });
        }

        return res.status(201).json({
            message: "Issue fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getTotalByStatus = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getTotalByStatus();

        if (!issue) {
            res.status(500).json({ message: 'Failed to count issues' });
        }

        return res.status(201).json({
            message: "Issue counted successfully",
            status: 'ok',
            data: issue
        });
    });

    getAverageDurationInHours = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getAverageDurationInHours();

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue duration' });
        }

        return res.status(201).json({
            message: "Issue duration fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getStatusPercentages = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getStatusPercentages();

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue status percentage' });
        }

        return res.status(201).json({
            message: "Issue status percentage fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getCategoriesPercentages = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getCategoriesPercentages();

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue category percentage' });
        }

        return res.status(201).json({
            message: "Issue category percentage fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getCreatedAtPercentages = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getCreatedAtPercentages();

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue time percentage' });
        }

        return res.status(201).json({
            message: "Issue time percentage fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getAssigneePercentages = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getAssigneePercentages();

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue assignee percentage' });
        }

        return res.status(201).json({
            message: "Issue assignee percentage fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getPriorityPercentages = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getPriorityPercentages();

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue priority percentage' });
        }

        return res.status(201).json({
            message: "Issue priority percentage fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    getIssueByStatus = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.getIssueByStatus(req.params.status);

        if (!issue) {
            res.status(500).json({ message: 'Failed to get issue' });
        }

        return res.status(201).json({
            message: "Issue fetched successfully",
            status: 'ok',
            data: issue
        });
    });

    updateIssue = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            attachments: [{ key: req.file.key, location: req.file.location }]
        } : req.body;

        const issue = await this.service.updateIssue(data);
        if (!issue) return res.status(500).json({ message: 'Failed to update issue' });

        const issueData = new Issue({
            issueId: issue.id,
            adminId: req.body.updatedBy,
            action: "updated an issue",
            reason: "to improve tracking",
            details: "updated an issue",
            feature: "Issue Management"
        });

        const log = await this.logService.createLog(issueData.createLog);
        if (!log) return res.status(500).json({ message: 'Failed to log issue' });

        if (data.status || data.category || data.priority || data.adminId) {
            const superAdmin = await this.adminService.getSuperAdmin();
            if (!superAdmin) return res.status(500).json({ message: 'Failed to fetch super admin.' });

            let notifType, notifTitle, adminContent, superAdminContent;

            if (data.status) {
                notifType = "Issue Status Updated";
                notifTitle = "Issue Status Updated";
                adminContent = `Your support ticket #${issue.id} status has been changed to ${data.status}. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} status was updated to ${data.status}. Click here to view details.`;

                if (data.status === "RESOLVED") {
                    const tenant = await this.tenantService.getTenantById(issue.tenantId);
                    if (!tenant) return res.status(500).json({ message: 'Failed to fetch tenant.' });

                    const tenantNotif = await this.notificationService.createNotification({
                        userId: tenant.id,
                        userType: "TENANT",
                        type: "Issue Resolved",
                        title: "Your Support Ticket Has Been Resolved",
                        content: `Great news! Your support ticket #${issue.id} — "${issue.subject}" has been resolved. Click here to view the details.`,
                        isRead: false
                    });

                    SocketService.emitToUser(tenantNotif.userId, tenantNotif.userType, "Issue Resolved", tenantNotif);

                    const attachments = [
                        {
                            filename: "Logowrap.png",
                            path: "Logowrap.png",
                            cid: "unique@image",
                            contentType: "Logowrap/png",
                        }
                    ];

                    const resolvedHtml = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Support Ticket Resolved – #${issue.id}</title>
                            <style>
                                body, table, td, p, a {
                                    margin: 0; padding: 0; border: 0;
                                    font-size: 100%; font: inherit; vertical-align: baseline;
                                }
                                body {
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                                    line-height: 1.6; color: #333333;
                                    background-color: #f5f5f5; margin: 0; padding: 20px;
                                }
                                .email-container {
                                    max-width: 600px; margin: 0 auto;
                                    background-color: #ffffff; border-radius: 12px;
                                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;
                                }
                                .email-content { padding: 40px 30px; }
                                .logo-container { margin-bottom: 30px; text-align: center; }
                                .logo {
                                    display: inline-flex; align-items: center;
                                    font-size: 40px; font-weight: 600;
                                    color: #000000; text-decoration: none;
                                }
                                .status-badge {
                                    display: inline-block;
                                    background-color: #ECFDF3;
                                    color: #027A48;
                                    border: 1px solid #6CE9A6;
                                    border-radius: 20px;
                                    padding: 6px 18px;
                                    font-size: 14px; font-weight: 600;
                                    margin-bottom: 20px;
                                }
                                .greeting { font-size: 16px; color: #333333; margin-bottom: 8px; }
                                .intro-text { font-size: 16px; color: #475467; margin-bottom: 30px; }
                                .section-title {
                                    font-size: 18px; font-weight: 600;
                                    color: #004ABA; margin-bottom: 16px;
                                    padding-bottom: 10px; border-bottom: 1px solid #E0E0E0;
                                }
                                .billing-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                                .billing-table tr { border-bottom: 1px solid #F2F4F7; }
                                .billing-table tr:last-child { border-bottom: none; }
                                .billing-table td { padding: 12px 0; font-size: 15px; }
                                .billing-label { color: #475467; width: 50%; }
                                .billing-value { color: #101828; font-weight: 500; text-align: right; }
                                .billing-value.resolved { color: #027A48; font-weight: 600; }
                                .info-box {
                                    background-color: #ECFDF3;
                                    border-radius: 8px; padding: 16px 20px; margin: 25px 0;
                                    border: 1px solid #6CE9A6; font-size: 15px; color: #054F31;
                                }
                                .support-text { font-size: 15px; color: #475467; margin-bottom: 25px; }
                                .support-text a { color: #004ABA; text-decoration: none; }
                                .divider { border: none; border-top: 1px solid #E0E0E0; margin: 25px 0; }
                                .footer { margin-top: 20px; }
                                .footer-text { color: #1976D2; font-size: 16px; margin-bottom: 5px; }
                                .team-signature { color: #1976D2; font-size: 16px; font-weight: 600; }
                                @media only screen and (max-width: 600px) {
                                    .email-container { margin: 0; border-radius: 0; }
                                    .email-content { padding: 30px 20px; }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="email-content">

                                    <div class="logo-container">
                                        <div class="logo">
                                            <img src="cid:unique@image" alt="NooSphere" srcset="">
                                        </div>
                                    </div>

                                    <div style="text-align: center;">
                                        <span class="status-badge">Ticket Resolved</span>
                                    </div>

                                    <p class="greeting">Hello ${tenant.name},</p>
                                    <p class="intro-text">
                                        Great news! Your support ticket has been resolved by our team.
                                    </p>

                                    <p class="section-title">Ticket Details</p>

                                    <table class="billing-table">
                                        <tr>
                                            <td class="billing-label">Ticket ID</td>
                                            <td class="billing-value" style="color: #004ABA; font-weight: 600;">#${issue.id}</td>
                                        </tr>
                                        <tr>
                                            <td class="billing-label">Subject</td>
                                            <td class="billing-value">${issue.subject}</td>
                                        </tr>
                                        <tr>
                                            <td class="billing-label">Category</td>
                                            <td class="billing-value">${issue.category}</td>
                                        </tr>
                                        <tr>
                                            <td class="billing-label">Priority</td>
                                            <td class="billing-value">${issue.priority}</td>
                                        </tr>
                                        <tr>
                                            <td class="billing-label">Status</td>
                                            <td class="billing-value resolved">Resolved</td>
                                        </tr>
                                        <tr>
                                            <td class="billing-label">Resolved On</td>
                                            <td class="billing-value">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                                        </tr>
                                    </table>

                                    <div class="info-box">
                                        If this issue persists or you have further questions, feel free to open a new support ticket and our team will be happy to assist.
                                    </div>

                                    <p class="support-text">
                                        For further assistance, contact us at
                                        <a href="mailto:support@noospherhub.net">support@noospherhub.net</a>
                                    </p>

                                    <hr class="divider">

                                    <div class="footer">
                                        <p class="footer-text">Best regards,</p>
                                        <p class="team-signature">NooSphere Support Team</p>
                                    </div>

                                </div>
                            </div>
                        </body>
                        </html>
                    `;

                    const sendMail = await MailService.sendMail(
                        tenant.email,
                        `Support Ticket Resolved – #${issue.id}`,
                        null,
                        resolvedHtml,
                        attachments
                    );

                    if (!sendMail.success) throw new Error("Failed to send resolution email to tenant");
                }

            } else if (data.priority) {
                notifType = "Issue Priority Updated";
                notifTitle = "Issue Priority Updated";
                adminContent = `The priority of your support ticket #${issue.id} has been changed to ${data.priority}. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} priority was updated to ${data.priority}. Click here to view details.`;
            } else if (data.category) {
                notifType = "Issue Category Updated";
                notifTitle = "Issue Category Updated";
                adminContent = `Your support ticket #${issue.id} has been recategorised to ${data.category}. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} category was updated to ${data.category}. Click here to view details.`;
            } else if (data.adminId) {
                notifType = "Issue Reassigned";
                notifTitle = "Issue Reassigned";
                adminContent = `Support ticket #${issue.id} has been assigned to you. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} has been reassigned to a new admin. Click here to view details.`;
            }

            const notif = await this.notificationService.createNotification({
                userId: issue.adminId,
                userType: "ADMIN",
                type: notifType,
                title: notifTitle,
                content: adminContent,
                isRead: false
            });

            const superAdminNotif = await this.notificationService.createNotification({
                userId: superAdmin.id,
                userType: "ADMIN",
                type: notifType,
                title: notifTitle,
                content: superAdminContent,
                isRead: false
            });

            SocketService.emitToUser(notif.userId, notif.userType, notifType, notif);
            SocketService.emitToUser(superAdminNotif.userId, superAdminNotif.userType, notifType, superAdminNotif);
        }

        return res.status(201).json({
            message: "Issue updated successfully",
            status: 'ok',
            data: issue
        });
    });

    createIssueComment = expressAsyncHandler(async (req, res) => {
        const comment = await this.service.createIssueComment(req.body);

        if (!comment) {
            res.status(500).json({ message: 'Failed to create issue comment' });
        }

        const issueData = new Issue({ issueId: comment.issueId, adminId: comment.adminId, action: "added a comment", reason: "to improve tracking", details: "commented on an issue", feature: "Issue Management" });

        const log = await this.logService.createLog(issueData.createLog);

        if (!log) {
            res.status(500).json({ message: 'Failed to log issue' });
        }

        return res.status(201).json({
            message: "Issue comment created successfully",
            status: 'ok',
            data: comment
        });
    });

}

export default IssueController;