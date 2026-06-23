import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import IssueRepository from "../../infrastructure/issueRepository.js";
import IssueCommentRepository from "../../infrastructure/issueCommentRepository.js";
import IssueService from "../../application/issueService.js";
import LogsService from "../../../logs/application/logsService.js";
import LogsRepository from "../../../logs/infrastructure/logsRepository.js";
import Issue from "../../domain/issue.js";
import AdminService from "../../../admin/application/adminService.js";
import AdminRepository from "../../../admin/infrastructure/adminRepository.js";
import MailService from "../../../../utilities/nodemailer.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
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
        this.adminRepository = new AdminRepository(this.prisma.admin);
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

        const submittedOn = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

        // Email to tenant
        if (data.tenantEmail) {
            const tenantHtml = templateRenderer.render('issue-submitted-tenant', {
                ticketId: data.ticketId || issue.id,
                tenantName: data.tenantName || 'Valued Customer',
                subject: data.subject || 'N/A',
                category: data.category || 'N/A',
                priority: data.priority || 'N/A',
                submittedOn,
            });
            await MailService.sendMail(
                data.tenantEmail,
                `Support Ticket Received – #${data.ticketId || issue.id}`,
                `Your support request has been successfully submitted.`,
                tenantHtml
            );
        }

        // Email to super admin
        const superAdmin = await this.adminService.getSuperAdmin();
        if (superAdmin?.email) {
            const superAdminHtml = templateRenderer.render('issue-submitted-superadmin', {
                ticketId: data.ticketId || issue.id,
                tenantName: data.tenantName || 'N/A',
                subject: data.subject || 'N/A',
                category: data.category || 'N/A',
                priority: data.priority || 'N/A',
                submittedOn,
            });
            await MailService.sendMail(
                superAdmin.email,
                `New Support Ticket Submitted – #${data.ticketId || issue.id}`,
                `A new support request has been submitted on NooSphere.`,
                superAdminHtml
            );
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
            tenantId: issue.tenantId,
            issueId: issue.id,
            adminId: req.user.type === "ADMIN" ? req.user.id : null,
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
                    const resolvedOn = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

                    const [tenant, assignedAdmin] = await Promise.all([
                        this.prisma.tenant.findUnique({ where: { id: issue.tenantId } }),
                        issue.adminId ? this.adminRepository.findOne({ where: { id: issue.adminId } }) : null,
                    ]);

                    const resolvedVars = {
                        ticketId: issue.id,
                        subject: issue.subject || 'N/A',
                        category: issue.category || 'N/A',
                        priority: issue.priority || 'N/A',
                        resolvedOn,
                    };

                    if (tenant?.email) {
                        const tenantHtml = templateRenderer.render('issue-resolved-tenant', {
                            ...resolvedVars,
                            tenantName: tenant.companyName || 'Valued Customer',
                        });
                        await MailService.sendMail(
                            tenant.email,
                            `Support Ticket Resolved – #${issue.id}`,
                            `Your support ticket #${issue.id} has been resolved.`,
                            tenantHtml
                        );
                    }

                    if (assignedAdmin?.email) {
                        const adminHtml = templateRenderer.render('issue-resolved-admin', {
                            ...resolvedVars,
                            adminName: `${assignedAdmin.firstName} ${assignedAdmin.lastName}`,
                            tenantName: tenant?.companyName || 'N/A',
                        });
                        await MailService.sendMail(
                            assignedAdmin.email,
                            `Issue Resolved – #${issue.id}`,
                            `You have resolved support ticket #${issue.id}.`,
                            adminHtml
                        );
                    }

                    // Email to super admin
                    if (superAdmin?.email) {
                        const superAdminHtml = templateRenderer.render('issue-resolved-superadmin', {
                            ...resolvedVars,
                            tenantName: tenant?.companyName || 'N/A',
                            resolvedBy: assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'N/A',
                        });
                        await MailService.sendMail(
                            superAdmin.email,
                            `Issue Resolved – #${issue.id}`,
                            `Support ticket #${issue.id} has been resolved on NooSphere.`,
                            superAdminHtml
                        );
                    }
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

                // Email to assigned admin
                const assignedAdmin = await this.adminRepository.findOne({ where: { id: data.adminId } });
                if (assignedAdmin?.email) {
                    const assignedHtml = templateRenderer.render('issue-assigned-admin', {
                        ticketId: issue.id,
                        assigneeName: `${assignedAdmin.firstName} ${assignedAdmin.lastName}`,
                        tenantName: issue.tenantName || 'N/A',
                        subject: issue.subject || 'N/A',
                        category: issue.category || 'N/A',
                        priority: issue.priority || 'N/A',
                    });
                    await MailService.sendMail(
                        assignedAdmin.email,
                        `Support Ticket Assigned to You – #${issue.id}`,
                        `Support ticket #${issue.id} has been assigned to you. Click here to view details.`,
                        assignedHtml
                    );
                }

                // Email to super admin
                if (superAdmin?.email) {
                    const superAdminAssignHtml = templateRenderer.render('issue-assigned-superadmin', {
                        ticketId: issue.id,
                        assigneeName: assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'N/A',
                        tenantName: issue.tenantName || 'N/A',
                        subject: issue.subject || 'N/A',
                        priority: issue.priority || 'N/A',
                    });
                    await MailService.sendMail(
                        superAdmin.email,
                        `Issue #${issue.id} Has Been Assigned`,
                        `Issue #${issue.id} has been reassigned to a new admin on NooSphere.`,
                        superAdminAssignHtml
                    );
                }
            }

            if (notifType && notifTitle) {
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
