class Logs {
    constructor({ logId, tenantId, issueId, reason, clientId, adminId, feature, module, action, details, ipAddress }) {
        this.logId = logId;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.adminId = adminId;
        this.feature = feature;
        this.module = module;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.reason = reason;
        this.issueId = issueId;
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
            reason: this.reason,
            issueId: this.issueId
        };
    }

}

export default Logs;