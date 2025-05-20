class Logs {
    constructor({ logId, tenantId, clientId, adminId, featureId, module, action, details, ipAddress }) {
        this.logId = logId;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.adminId = adminId;
        this.featureId = featureId;
        this.module = module;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
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
            ipAddress: this.ipAddress
        };
    }

}

export default Logs;