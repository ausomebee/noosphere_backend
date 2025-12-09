import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import SessionRepository from "../../infrastructure/sessionRepository.js";
import SessionDataRepository from "../../infrastructure/sessionDataRepository.js";

import SessionService from "../../application/sessionService.js";
import SessionDataService from "../../application/sessionDataService.js";

import Session from "../../domain/session.js";
import SessionData from "../../domain/sessionData.js";

class SessionController {
    constructor() {
        this.prisma = prismaService.getClient();

        const sessionRepository = new SessionRepository(this.prisma.session);
        const sessionDataRepository = new SessionDataRepository(this.prisma.sessionData);

        this.sessionService = new SessionService({ sessionRepository });
        this.sessionDataService = new SessionDataService({ sessionDataRepository });
    }

    createSession = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const sessionPayload = new Session(data);
        const session = await this.sessionService.createSession(sessionPayload.createSession);

        if (!session) {
            return res.status(500).json({ message: "Failed to create session" });
        }

        for (const sd of data.sessionDatas || []) {
            const sdPayload = new SessionData({ ...sd, sessionId: session.id });
            const newSD = await this.sessionDataService.createSessionData(sdPayload.createSessionData);

            if (!newSD) {
                return res.status(500).json({ message: "Failed to create session data" });
            }
        }

        return res.status(201).json({
            message: "Session created successfully",
            status: "ok",
            data: session,
        });
    });

    updateSession = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const updatedSession = await this.sessionService.updateSession(data);

        if (!updatedSession) {
            return res.status(404).json({
                message: "Session not found or failed to update",
            });
        }

        for (const sd of data.sessionDatas || []) {
            if (sd.id) {
                const sdPayload = { ...sd, sessionId: data.id };
                const updatedSD = await this.sessionDataService.updateSessionData(sdPayload);

                if (!updatedSD) {
                    return res.status(500).json({ message: "Failed to update session data" });
                }
            } else {
                const sdPayload = new SessionData({ ...sd, sessionId: data.id });
                const newSD = await this.sessionDataService.createSessionData(sdPayload.createSessionData);

                if (!newSD) {
                    return res.status(500).json({ message: "Failed to create new session data" });
                }
            }
        }

        return res.status(200).json({
            message: "Session updated successfully",
            status: "ok",
            data: updatedSession,
        });
    });

    getSingleSession = expressAsyncHandler(async (req, res) => {
        const session = await this.sessionService.getSingleSession(req.params.id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
            message: "Session fetched successfully",
            status: "ok",
            data: session,
        });
    });

    getSessions = expressAsyncHandler(async (req, res) => {
        const sessions = await this.sessionService.getSessions(req.params.tenantId);

        if (!sessions) {
            return res.status(404).json({ message: "No sessions found" });
        }

        const formatted = sessions.map((s) => {
            const totalHours =
                (new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60 * 60);

            return {
                id: s.id,
                clientName:
                    s.appointment.client.preferredName ||
                    `${s.appointment.client.firstName} ${s.appointment.client.lastName}`,
                sessionTypeName: s.appointment.session.name,
                clinician: s.approver?.fullName,
                clientApprovalStatus: s.clientApprovalStatus,
                supervisorApprovalStatus: s.supervisorApprovalStatus,
                totalHours,
            };
        });

        return res.status(200).json({
            message: "Sessions fetched successfully",
            status: "ok",
            data: formatted,
        });
    });
}

export default SessionController;
