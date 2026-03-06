import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import IssueRepository from "../../infrastructure/issueRepository.js";
import IssueCommentRepository from "../../infrastructure/issueCommentRepository.js";
import IssueService from "../../application/issueService.js";
import LogsService from "../../../logs/application/logsService.js";
import LogsRepository from "../../../logs/infrastructure/logsRepository.js";
import Issue from "../../domain/issue.js";

class IssueController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.issueRepository = new IssueRepository(this.prisma.issue);
        this.issueCommentRepository = new IssueCommentRepository(this.prisma.issueComment);
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.service = new IssueService({ issueRepository: this.issueRepository, issueCommentRepository: this.issueCommentRepository });
        this.logService = new LogsService({ logsRepository: this.logsRepository });
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
            attachments: [
                {
                    key: req.file.key,
                    location: req.file.location
                }
            ]
        } : req.body
        const issue = await this.service.updateIssue(data);

        if (!issue) {
            res.status(500).json({ message: 'Failed to update issue' });
        }

        const issueData = new Issue({ issueId: issue.id, adminId: req.body.updatedBy, action: "updated an issue", reason: "to improve traching", details: "updated an issue", module: "issue management" });

        const log = await this.logService.createLog(issueData.createLog);

        if (!log) {
            res.status(500).json({ message: 'Failed to log issue' });
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

        const issueData = new Issue({ issueId: comment.issueId, adminId: comment.adminId, action: "added a comment", reason: "to improve tracking", details: "commented on an issue", module: "issue management" });

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