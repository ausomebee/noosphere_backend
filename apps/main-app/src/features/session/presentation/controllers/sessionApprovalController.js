import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import SessionApprovalRepository from "../../infrastructure/sessionApprovalRepository.js";
import SessionApprovalService from "../../application/sessionApprovalService.js";
import SessionApproval from "../../domain/sessionApproval.js";
import SessionRepository from "../../infrastructure/sessionRepository.js";
import SessionService from "../../application/sessionService.js";
import TimesheetHistoryRepository from "../../infrastructure/timesheetHistoryRepository.js";
import TimesheetHistoryService from "../../application/timesheetHistoryService.js";
import TimesheetHistory from "../../domain/timesheetHistory.js";

class SessionApprovalController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new SessionApprovalRepository(this.prisma.sessionApproval);
        this.service = new SessionApprovalService({ sessionApprovalRepository: this.repository });
        this.sessionRepository = new SessionRepository(this.prisma);
        this.sessionService = new SessionService({ sessionRepository: this.sessionRepository });
        this.historyRepository = new TimesheetHistoryRepository(this.prisma.timesheetHistory);
        this.historyService = new TimesheetHistoryService({ timesheetHistoryRepository: this.historyRepository });
    }

    createSessionApproval = expressAsyncHandler(async (req, res) => {
        const data = new SessionApproval(req.body);
        const newRecord = await this.service.createSessionApproval(data.createSessionApproval);

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create session approval" });
        }

        const updatedSession = await this.sessionService.updateSession({ id: data.sessionId, clientApprovalStatus: 'APPROVED' });

        if (!updatedSession) {
            return res.status(404).json({
                message: "Session not found or failed to approve",
            });
        }

        const historyData = new TimesheetHistory({
            sessionId: data.sessionId,
            action: "CLIENT APPROVED",
            details: "Session approved successfully",
            createdBy: data.createdBy
        });

        const newHistory = await this.historyService.createTimesheetHistory(historyData.createTimesheetHistory);

        if (!newHistory) {
            return res.status(500).json({ message: "Failed to create timesheet history" });
        }

        return res.status(201).json({
            message: "Session approval created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateSessionApproval = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateSessionApproval(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update session approval" });
        }

        return res.status(200).json({
            message: "Session approval updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleSessionApproval = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleSessionApproval(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Session approval not found" });
        }

        return res.status(200).json({
            message: "Session approval fetched successfully",
            status: "ok",
            data: record
        });
    });

    getSessionApprovals = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getSessionApprovals(req.params.sessionId);

        if (!records) {
            return res.status(404).json({ message: "No session approvals found" });
        }

        return res.status(200).json({
            message: "Session approvals fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default SessionApprovalController;
