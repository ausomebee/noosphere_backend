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

}

export default IssueController;