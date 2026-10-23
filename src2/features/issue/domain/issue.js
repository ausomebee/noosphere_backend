class Issue {
    constructor({
        id,
        category,
        priority,
        tenantId,
        adminId,
        title,
        adminLoggedById,
        status,
        resolutionDeadline,
        attachments,
        description,
        resolutionDescription,
        createdAt,
        updatedAt,
        issueId,
        action,
        reason,
        details,
        comment
    }) {
        this.id = id;
        this.category = category;
        this.priority = priority;
        this.tenantId = tenantId;
        this.adminId = adminId;
        this.title = title;
        this.adminLoggedById = adminLoggedById;
        this.status = status;
        this.resolutionDeadline = resolutionDeadline;
        this.attachments = attachments;
        this.description = description;
        this.resolutionDescription = resolutionDescription;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.issueId = issueId;
        this.details = details;
        this.reason = reason;
        this.action = action;
        this.comment = comment;
    }

    get createIssue() {
        return {
            tenantId: this.tenantId,
            title: this.title,
            description: this.description,
            category: this.category,
            priority: this.priority,
            adminId: this.adminId,
            resolutionDeadline: this.resolutionDeadline,
            attachments: this.attachments,
            adminLoggedById: this.adminLoggedById,
            status: this.adminId ? "Not Started" : "Unassigned",
        };
    }

    get createIssueComment() {
        return {
            issueId: this.issueId,
            comment: this.comment,
            adminId: this.adminId
        };
    }

    get createLog() {
        return {
            issueId: this.issueId,
            action: this.action,
            adminId: this.adminId,
            reason: this.reason,
            details: this.details
        }
    }

}

export default Issue;