import Issue from "../domain/issue.js";

class IssueService {
    constructor({ issueRepository, issueCommentRepository }) {
        this.issueRepository = issueRepository;
        this.issueCommentRepository = issueCommentRepository;
    }

    async createIssue(data) {
        const issueData = new Issue(data)

        const newIssue = await this.issueRepository.create(issueData.createIssue);

        if (!newIssue) {
            throw new Error("Failed to create issue");
        }

        return newIssue;
    }

    async getSingleIssue(id) {
        const issue = await this.issueRepository.findOneAndPopulate({ id });

        if (!issue) {
            throw new Error("Failed to fetch issue");
        }

        return issue;
    }

}

export default IssueService;