class Logs {
    constructor({ logId, tenantId, issueId, reason, clientId, adminId, featureId, module, action, details, ipAddress }) {
        this.logId = logId;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.adminId = adminId;
        this.featureId = featureId;
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
            featureId: this.featureId,
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