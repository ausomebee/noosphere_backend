class Logs {
    constructor({ logId, tenantId, issueId, subscriptionId, reason, clientId, adminId, feature, module, action, details, ipAddress, userAgent, outcome, accessedBy, location }) {
        this.logId = logId;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.adminId = adminId;
        this.feature = feature;
        this.module = module;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.outcome = outcome;
        this.accessedBy = accessedBy;
        this.location = location;
        this.reason = reason;
        this.issueId = issueId;
        this.subscriptionId = subscriptionId;
    }

    get createLog() {
        return {
            tenantId: this.tenantId,
            clientId: this.clientId,
            adminId: this.adminId,
            feature: this.feature,
            module: this.module,
            action: this.action,
            details: this.details,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            outcome: this.outcome,
            accessedBy: this.accessedBy,
            location: this.location,
            reason: this.reason,
            issueId: this.issueId,
            subscriptionId: this.subscriptionId
        };
    }

}

export default Logs;
