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

    async getTotalByStatus() {
        const All = await this.issueRepository.totalCountDynamic({});
        const Resolved = await this.issueRepository.totalCountDynamic({ status: "Resolved" });
        const InProgress = await this.issueRepository.totalCountDynamic({ status: "In Progress" });
        const NotStarted = await this.issueRepository.totalCountDynamic({ status: "Not Started" });
        const Unassigned = await this.issueRepository.totalCountDynamic({ status: "Unassigned" });

        if (!All || !Resolved || !InProgress || !NotStarted || !Unassigned) {
            throw new Error("Failed to count invoice");
        }

        const sorted = Object.fromEntries(
            Object.entries({ All, Resolved, InProgress, NotStarted, Unassigned }).sort(([, a], [, b]) => b._count._all - a._count._all)
        );

        return sorted;
    }

    async getAverageDurationInHours() {
        const issues = await this.issueRepository.averageResolutionTime()

        const durationsInHours = issues.map(issue => {
            const created = new Date(issue.createdAt);
            const updated = new Date(issue.updatedAt);
            const diffMs = updated.getTime() - created.getTime();
            return diffMs / (1000 * 60 * 60);
        });

        const total = durationsInHours.reduce((acc, val) => acc + val, 0);
        const average = durationsInHours.length ? total / durationsInHours.length : 0;

        console.log(`Average time between createdAt and updatedAt: ${average.toFixed(2)} hours`);
        return average.toFixed(2);
    }

    async getStatusPercentages() {
        const totalCount = await this.issueRepository.totalCount();

        if (totalCount === 0) {
            return {};
        }

        const groupedCounts = await this.issueRepository.groupedCounts("status", { status: true, });

        const percentages = groupedCounts.map(group => ({
            status: group.status,
            count: group._count.status,
            percentage: ((group._count.status / totalCount) * 100).toFixed(2),
        }));

        const sorted = percentages.sort((x, y) => parseFloat(y.percentage) - parseFloat(x.percentage));

        return sorted;
    }

    async getCategoriesPercentages() {
        const totalCount = await this.issueRepository.totalCount();

        if (totalCount === 0) {
            return {};
        }

        const groupedCounts = await this.issueRepository.groupedCounts("category", { category: true, });

        const percentages = groupedCounts.map(group => ({
            category: group.category,
            count: group._count.category,
            percentage: ((group._count.category / totalCount) * 100).toFixed(2),
        }));

        const sorted = percentages.sort((x, y) => parseFloat(y.percentage) - parseFloat(x.percentage));

        return sorted;
    }

    async getAssigneePercentages() {
        const totalCount = await this.issueRepository.totalCount();

        if (totalCount === 0) {
            return [];
        }

        const groupedCounts = await this.issueRepository.groupedCounts("adminId", { adminId: true, });

        const adminIds = groupedCounts.map(g => g.adminId).filter(id => id !== null);

        const assignees = await this.issueRepository.tenants(adminIds);

        const nameMap = Object.fromEntries(
            assignees.map(user => [user.assignedTo.id, user.assignedTo.fullName])
        );

        const percentages = groupedCounts.map(group => {
            const fullName = group.adminId ? nameMap[group.adminId] : 'Unassigned';

            return {
                assignedTo: fullName,
                count: group._count.adminId,
                percentage: ((group._count.adminId / totalCount) * 100).toFixed(2),
            };
        });

        const sorted = percentages.sort((x, y) => parseFloat(y.percentage) - parseFloat(x.percentage));

        return sorted;
    }

    async getCreatedAtPercentages() {
        const totalCount = await this.issueRepository.totalCount();

        if (totalCount === 0) {
            return {};
        }

        const groupedCounts = await this.issueRepository.groupedCounts("createdAt", { createdAt: true, });

        const percentages = groupedCounts.map(group => ({
            createdAt: group.createdAt,
            count: group._count.createdAt,
            percentage: ((group._count.createdAt / totalCount) * 100).toFixed(2),
        }));

        const sorted = percentages.sort((x, y) => parseFloat(y.percentage) - parseFloat(x.percentage));

        return sorted;
    }

    async getPriorityPercentages() {
        const totalCount = await this.issueRepository.totalCount();

        if (totalCount === 0) {
            return {};
        }

        const groupedCounts = await this.issueRepository.groupedCounts("priority", { priority: true, });

        const percentages = groupedCounts.map(group => ({
            priority: group.priority,
            count: group._count.priority,
            percentage: ((group._count.priority / totalCount) * 100).toFixed(2),
        }));

        const sorted = percentages.sort((x, y) => parseFloat(y.percentage) - parseFloat(x.percentage));

        return sorted;
    }
}

export default IssueService;