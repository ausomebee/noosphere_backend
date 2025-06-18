import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import IssueRepository from "../../infrastructure/issueRepository.js";
import IssueCommentRepository from "../../infrastructure/issueCommentRepository.js";
import IssueService from "../../application/issueService.js";

class IssueController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.issueRepository = new IssueRepository(this.prisma.issue);
        this.issueCommentRepository = new IssueCommentRepository(this.prisma.issueComment);
        this.service = new IssueService({ issueRepository: this.issueRepository, issueCommentRepository: this.issueCommentRepository });
    }

    createIssue = expressAsyncHandler(async (req, res) => {
        const issue = await this.service.createIssue(req.body);

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

}

export default IssueController;