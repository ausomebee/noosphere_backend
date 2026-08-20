import prismaService from "../../../config/prisma.js";
import LogsRepository from "../infrastructure/logsRepository.js";
import LogsService from "./logsService.js";

// Centralized, non-blocking audit logger so a logging failure never fails the primary request.
class AuditLogger {
    constructor() {
        this.logsService = null;
    }

    _getService() {
        if (!this.logsService) {
            const prisma = prismaService.getClient();
            this.logsService = new LogsService({ logsRepository: new LogsRepository(prisma.logs) });
        }
        return this.logsService;
    }

    async log(req, {
        tenantId = null,
        clientId = null,
        adminId = null,
        module = null,
        feature = null,
        action,
        reason,
        details = null,
        outcome = "SUCCESS",
        accessedBy = null,
        issueId = null,
        subscriptionId = null,
    } = {}) {
        try {
            const service = this._getService();
            await service.createLog({
                tenantId,
                clientId,
                adminId,
                module,
                feature,
                action,
                reason,
                details,
                ipAddress: req?.ip || null,
                userAgent: req?.headers?.["user-agent"] || null,
                outcome,
                accessedBy,
                location: req?.originalUrl || req?.url || null,
                issueId,
                subscriptionId,
            });
        } catch (err) {
            console.error("[auditLogger] Failed to record log:", err.message);
        }
    }
}

export default new AuditLogger();
