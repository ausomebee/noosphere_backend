class ServerRequest {
    constructor({
        requestId,
        tenantId,
        adminId,
        tenantStaffId,
        clientId,
        method,
        endpoint,
        statusCode,
        durationMs,
        ipAddress,
        userAgent,
        errorMessage,
    }) {
        this.requestId = requestId;
        this.tenantId = tenantId;
        this.adminId = adminId;
        this.tenantStaffId = tenantStaffId;
        this.clientId = clientId;
        this.method = method;
        this.endpoint = endpoint;
        this.statusCode = statusCode;
        this.durationMs = durationMs;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.errorMessage = errorMessage;
    }

    get createRequest() {
        return {
            tenantId: this.tenantId,
            adminId: this.adminId,
            tenantStaffId: this.tenantStaffId,
            tenantClientId: this.clientId,
            method: this.method,
            endpoint: this.endpoint,
            statusCode: this.statusCode,
            durationMs: this.durationMs,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            errorMessage: this.errorMessage,
        };
    }
}

export default ServerRequest;