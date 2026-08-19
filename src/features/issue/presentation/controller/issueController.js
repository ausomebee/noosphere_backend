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
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";

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

    async getIssueAdminRecipients(includeAssignedAdminId = null) {
        const admins = await this.prisma.admin.findMany({
            where: {
                active: true,
                isDeleted: false,
                OR: [
                    { superAdmin: true },
                    { roles: { roleModuleAccesses: { some: { module: "ISSUE_MANAGEMENT" } } } },
                    ...(includeAssignedAdminId ? [{ id: includeAssignedAdminId }] : []),
                ],
            },
            select: { id: true },
        });
        return admins.map((admin) => ({ userId: admin.id, userType: "ADMIN" }));
    }

    async notifyIssue({ recipients, type, title, content, issue, metadata = {} }) {
        return this.notificationService.dispatch({
            recipients,
            type,
            title,
            content,
            entityType: NotificationEntityType.ISSUE,
            entityId: issue.id,
            metadata: { tenantId: issue.tenantId, ...metadata },
        }, SocketService.emitToUser.bind(SocketService));
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
        const issueTenant = await this.prisma.tenant.findUnique({
            where: { id: issue.tenantId },
            select: { email: true, companyName: true },
        });

        await this.notifyIssue({
            recipients: await this.getIssueAdminRecipients(issue.adminId),
            type: NotificationType.ISSUE_SUBMITTED,
            title: "Issue Submitted",
            content: "A support request has been submitted. Click here to view details.",
            issue,
            metadata: { category: issue.category, priority: issue.priority, submittedOn },
        });

        if (issue.adminId) {
            const tenantStaff = await this.prisma.tenantStaff.findMany({
                where: { tenantId: issue.tenantId, isDeleted: false, active: true },
                select: { id: true },
            });
            const assignedAdmin = await this.prisma.admin.findUnique({ where: { id: issue.adminId }, select: { firstName: true, lastName: true } });
            const assigneeName = assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : "an admin";
            await this.notifyIssue({
                recipients: await this.getIssueAdminRecipients(issue.adminId),
                type: NotificationType.ISSUE_ASSIGNED,
                title: "Issue Assigned",
                content: `A support request has been assigned to ${assigneeName}. Click here to view details.`,
                issue,
                metadata: { assignedAdminId: issue.adminId },
            });
            await this.notifyIssue({
                recipients: [{ userId: issue.adminId, userType: "ADMIN" }],
                type: NotificationType.ISSUE_ASSIGNED_ADMIN,
                title: "Issue Assigned",
                content: "A support request has been assigned to you. Please review.",
                issue,
                metadata: { assignedAdminId: issue.adminId },
            });
            await this.notifyIssue({
                recipients: tenantStaff.map((staff) => ({ userId: staff.id, userType: "TENANT_STAFF" })),
                type: NotificationType.ISSUE_ASSIGNED,
                title: "Support Request Assigned",
                content: `Your support request is now being handled by ${assigneeName}.`,
                issue,
                metadata: { assignedAdminId: issue.adminId },
            });
        }

        // Email to tenant
        if (data.tenantEmail || issueTenant?.email) {
            const tenantHtml = templateRenderer.render('issue-submitted-tenant', {
                ticketId: data.ticketId || issue.id,
                tenantName: data.tenantName || issueTenant?.companyName || 'Valued Customer',
                subject: data.subject || 'N/A',
                category: data.category || 'N/A',
                priority: data.priority || 'N/A',
                submittedOn,
            });
            await MailService.sendMail(
                data.tenantEmail || issueTenant.email,
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

        const previousIssue = await this.issueRepository.findOne({ id: data.id });
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

        const log = await this.logService.createLog({
            ...issueData.createLog,
            ipAddress: req.ip || null,
            userAgent: req.headers["user-agent"] || null,
            outcome: "SUCCESS",
            accessedBy: req.user?.name || null,
        });
        if (!log) return res.status(500).json({ message: 'Failed to log issue' });

        if (data.status || data.category || data.priority || data.adminId) {
            const superAdmin = await this.adminService.getSuperAdmin();
            if (!superAdmin) return res.status(500).json({ message: 'Failed to fetch super admin.' });

            let notifType, notifTitle, adminContent, superAdminContent;

            if (data.status === "RESOLVED" || data.status === "Resolved") {
                notifType = NotificationType.ISSUE_RESOLVED;
                notifTitle = "Issue Resolved";
                adminContent = `Your support ticket #${issue.id} status has been changed to ${data.status}. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} status was updated to ${data.status}. Click here to view details.`;

                if (data.status === "RESOLVED" || data.status === "Resolved") {
                    const resolvedOn = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

                    const [tenant, assignedAdmin] = await Promise.all([
                        this.prisma.tenant.findUnique({ where: { id: issue.tenantId } }),
                        issue.adminId ? this.adminRepository.findOne({ id: issue.adminId }) : null,
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

            } else if (data.status === "IN_PROGRESS" || data.status === "In Progress") {
                notifType = NotificationType.ISSUE_IN_PROGRESS;
                notifTitle = "Issue In Progress";
                adminContent = `Support ticket #${issue.id} has been marked as in progress.`;
                superAdminContent = `Support ticket #${issue.id} has been marked as in progress.`;
            } else if (data.priority) {
                notifType = NotificationType.ISSUE_PRIORITY_CHANGED;
                notifTitle = "Issue Priority Changed";
                adminContent = `The priority of your support ticket #${issue.id} has been changed to ${data.priority}. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} priority was updated to ${data.priority}. Click here to view details.`;
            } else if (data.category) {
                notifType = NotificationType.ISSUE_CATEGORY_CHANGED;
                notifTitle = "Issue Category Changed";
                adminContent = `Your support ticket #${issue.id} has been recategorised to ${data.category}. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} category was updated to ${data.category}. Click here to view details.`;
            } else if (data.adminId) {
                const isReassignment = Boolean(previousIssue?.adminId && previousIssue.adminId !== data.adminId);
                notifType = isReassignment ? NotificationType.ISSUE_REASSIGNED : NotificationType.ISSUE_ASSIGNED;
                notifTitle = isReassignment ? "Issue Reassigned" : "Issue Assigned";
                adminContent = `Support ticket #${issue.id} has been assigned to you. Click here to view details.`;
                superAdminContent = `Issue #${issue.id} has been reassigned to a new admin. Click here to view details.`;

                // Email to assigned admin
                const assignedAdmin = await this.adminRepository.findOne({ id: data.adminId });
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

                const tenant = await this.prisma.tenant.findUnique({
                    where: { id: issue.tenantId },
                    select: { email: true, companyName: true },
                });
                if (tenant?.email) {
                    const assigneeName = assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : "a support specialist";
                    await MailService.sendMail(
                        tenant.email,
                        `Support Ticket Assigned – #${issue.id}`,
                        `Your support request is now being handled by ${assigneeName}.`,
                        `<p>Hello ${tenant.companyName},</p><p>Your support request is now being handled by ${assigneeName}.</p><p>Ticket ID: #${issue.id}<br>Subject: ${issue.title}</p><p>Best regards,<br>NooSphere Support Team</p>`
                    );
                }
            }

            if (notifType && notifTitle) {
                let adminNotif = null;

                if (issue.adminId) {
                    adminNotif = await this.notificationService.createNotification({
                        userId: issue.adminId,
                        userType: "ADMIN",
                        type: notifType,
                        title: notifTitle,
                        content: adminContent,
                        entityType: NotificationEntityType.ISSUE,
                        entityId: issue.id,
                        metadata: { tenantId: issue.tenantId },
                        isRead: false
                    });
                }

                const superAdminNotif = await this.notificationService.createNotification({
                    userId: superAdmin.id,
                    userType: "ADMIN",
                    type: notifType,
                    title: notifTitle,
                    content: superAdminContent,
                    entityType: NotificationEntityType.ISSUE,
                    entityId: issue.id,
                    metadata: { tenantId: issue.tenantId },
                    isRead: false
                });

                if (adminNotif) {
                    SocketService.emitToUser(adminNotif.userId, adminNotif.userType, "newNotification", { notification: adminNotif });
                }
                SocketService.emitToUser(superAdminNotif.userId, superAdminNotif.userType, "newNotification", { notification: superAdminNotif });
            }

            if (data.adminId && issue.adminId) {
                await this.notifyIssue({
                    recipients: [{ userId: issue.adminId, userType: "ADMIN" }],
                    type: NotificationType.ISSUE_ASSIGNED_ADMIN,
                    title: "Issue Assigned",
                    content: "A support request has been assigned to you. Please review.",
                    issue,
                    metadata: { assignedAdminId: issue.adminId },
                });

                if (previousIssue?.adminId && previousIssue.adminId !== issue.adminId) {
                    await this.notifyIssue({
                        recipients: [{ userId: previousIssue.adminId, userType: "ADMIN" }],
                        type: NotificationType.ISSUE_REASSIGNED,
                        title: "Issue Reassigned",
                        content: `Support ticket #${issue.id} has been assigned to a new admin.`,
                        issue,
                        metadata: { previousAdminId: previousIssue.adminId, assignedAdminId: issue.adminId },
                    });
                }
            }

            if (data.status === "RESOLVED" || data.status === "Resolved") {
                const tenantStaff = await this.prisma.tenantStaff.findMany({
                    where: { tenantId: issue.tenantId, isDeleted: false, active: true },
                    select: { id: true },
                });
                await this.notifyIssue({
                    recipients: tenantStaff.map((staff) => ({ userId: staff.id, userType: "TENANT_STAFF" })),
                    type: NotificationType.ISSUE_RESOLVED,
                    title: "Issue Resolved",
                    content: `Your support ticket #${issue.id} has been resolved.`,
                    issue,
                    metadata: { status: issue.status },
                });
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

        const log = await this.logService.createLog({
            ...issueData.createLog,
            tenantId: comment.tenantId || null,
            ipAddress: req.ip || null,
            userAgent: req.headers["user-agent"] || null,
            outcome: "SUCCESS",
            accessedBy: req.user?.name || null,
        });

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
