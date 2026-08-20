import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import LogsRepository from "../../infrastructure/logsRepository.js";
import LogsService from "../../application/logsService.js";

class LogsController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.service = new LogsService({ logsRepository: this.logsRepository });
    }

    createLog = expressAsyncHandler(async (req, res) => {
        const actorName = req.user?.name || req.body.accessedBy || null;
        const log = await this.service.createLog({
            ...req.body,
            ipAddress: req.ip || req.body.ipAddress || null,
            userAgent: req.headers["user-agent"] || req.body.userAgent || null,
            outcome: req.body.outcome || "SUCCESS",
            accessedBy: actorName,
            location: req.originalUrl || req.url || req.body.location || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : req.body.adminId,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : req.body.clientId,
            tenantId: req.user?.tenantId || req.body.tenantId
        });

        if (!log) {
            res.status(500).json({ message: 'Failed to create log' });
        }

        return res.status(201).json({
            message: "Log created successfully",
            status: 'ok',
            data: log
        });
    });

    getSingleLog = expressAsyncHandler(async (req, res) => {
        const log = await this.service.getSingleLog(req.params);

        if (!log) {
            res.status(500).json({ message: 'Failed to fetch log' });
        }

        return res.status(201).json({
            message: "Log fetched successfully",
            status: 'ok',
            data: log
        });
    });

    getTenantLogs = expressAsyncHandler(async (req, res) => {
        const query = { ...req.query, adminId: null };
        const logs = await this.service.getTenantLogs(query);

        if (!logs) {
            res.status(500).json({ message: 'Failed to fetch logs' });
        }

        return res.status(201).json({
            message: "Logs fetched successfully",
            status: 'ok',
            data: logs
        });
    });

    getTenantLogsGroupedByFeature = expressAsyncHandler(async (req, res) => {
        const logs = await this.service.getTenantLogsGroupedByFeature(req.query);

        if (!logs) {
            res.status(500).json({ message: 'Failed to fetch logs' });
        }

        return res.status(201).json({
            message: "Logs fetched successfully",
            status: 'ok',
            data: logs
        });
    });
}

export default LogsController;