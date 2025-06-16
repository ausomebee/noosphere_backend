class Issue {
    constructor({
        id,
        category,
        priority,
        tenantId,
        adminId,
        title,
        tenantStaffId,
        status,
        resolutionDeadline,
        attachments,
        description,
        resolutionDescription,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.category = category;
        this.priority = priority;
        this.tenantId = tenantId;
        this.adminId = adminId;
        this.title = title;
        this.tenantStaffId = tenantStaffId;
        this.status = status;
        this.resolutionDeadline = resolutionDeadline;
        this.attachments = attachments;
        this.description = description;
        this.resolutionDescription = resolutionDescription;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
            tenantStaffId: this.tenantStaffId,
            status: this.adminId ? "Not Started" : "Unassigned",
        };
    }

}

export default Issue;