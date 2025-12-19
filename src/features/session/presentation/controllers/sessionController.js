import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import SessionRepository from "../../infrastructure/sessionRepository.js";
import SessionDataRepository from "../../infrastructure/sessionDataRepository.js";

import SessionService from "../../application/sessionService.js";
import SessionDataService from "../../application/sessionDataService.js";

import Session from "../../domain/session.js";
import SessionData from "../../domain/sessionData.js";
import ClientAuthorizationRepository from "../../../client/infrastructure/clientAuthorizationRepository.js";
import ClientAuthorizationService from "../../../client/application/clientAuthorizationService.js";
import AppointmentRepository from "../../../appointment/infrastructure/appointmentRepository.js";
import AppointmentService from "../../../appointment/application/appointmentService.js";
import ClientAuthorizationServiceRepository from "../../../client/infrastructure/clientAuthorizationServiceRepository.js";
import ClientAuthorizationServiceService from "../../../client/application/clientAuthorizationServiceService.js";
import TimesheetHistoryRepository from "../../infrastructure/timesheetHistoryRepository.js";
import TimesheetHistoryService from "../../application/timesheetHistoryService.js";

class SessionController {
    constructor() {
        this.prisma = prismaService.getClient();

        const sessionRepository = new SessionRepository(this.prisma.session);
        const sessionDataRepository = new SessionDataRepository(this.prisma.sessionData);

        this.sessionService = new SessionService({ sessionRepository });
        this.sessionDataService = new SessionDataService({ sessionDataRepository });

        this.clientAuthorizationRepository = new ClientAuthorizationRepository(this.prisma.clientAuthorization, this.prisma.clientAuthorizationService);
        this.clientAuthorizationService = new ClientAuthorizationService({
            clientAuthorizationRepository: this.clientAuthorizationRepository
        });

        this.appointmentRepository = new AppointmentRepository(this.prisma.appointment, this.prisma);
        this.appointmentService = new AppointmentService({ appointmentRepository: this.appointmentRepository });

        this.clientAuthorizationServiceRepository = new ClientAuthorizationServiceRepository(this.prisma.clientAuthorizationService);
        this.clientAuthorizationServiceService = new ClientAuthorizationServiceService({
            clientAuthorizationServiceRepository: this.clientAuthorizationServiceRepository
        });

        this.historyRepository = new TimesheetHistoryRepository(this.prisma.timesheetHistory);
        this.historyService = new TimesheetHistoryService({ timesheetHistoryRepository: this.historyRepository });
    }

    createSession = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        let unitsUsed
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);

        const diffMs = end - start;         
        const diffHours = diffMs / (1000 * 60 * 60);

        unitsUsed = Math.ceil(diffHours);

        const appointments = await this.appointmentService.getAppointmentsForTimesheet(data.appointmentId);

        const candidateAuthorizations = await this.clientAuthorizationService.getAuthorizationForTimesheet(appointments.tenantClientId, appointments.requiredServices);

        const usableAuthorizations = [];

        for (const auth of candidateAuthorizations) {
            const usableServices = [];

            for (const svc of auth.clientAuthorizationServices) {
                const remainingUnits = svc.units - svc.usedUnit;

                if (remainingUnits > 0) {
                    const updateService = await this.clientAuthorizationServiceService.updateUnitUsed({ id: svc.id, unitsUsed: unitsUsed })
                    usableServices.push({
                        id: svc.id,
                        serviceCodeId: svc.serviceCodeId,
                        remainingUnits,
                    });
                }
            }

            if (usableServices.length > 0) {
                usableAuthorizations.push({
                    id: auth.id,
                    services: usableServices,
                });
            }
        }

        const remaining = new Map(
            appointments.requiredServices.map(s => [s.serviceCodeId, unitsUsed])
        );

        const selectedAuthIds = new Set();

        while (remaining.size > 0) {
            let bestAuth = null;
            let bestCoverage = 0;

            for (const auth of usableAuthorizations) {
                let coverage = 0;

                for (const svc of auth.services) {
                    const requiredUnits = remaining.get(svc.serviceCodeId);
                    if (!requiredUnits) continue;

                    if (svc.remainingUnits >= requiredUnits) {
                        coverage++;
                    }
                }

                if (coverage > bestCoverage) {
                    bestCoverage = coverage;
                    bestAuth = auth;
                }
            }

            if (!bestAuth) {
                throw new Error(
                    "Insufficient authorization units to cover appointment services"
                );
            }

            selectedAuthIds.add(bestAuth.id);

            for (const svc of bestAuth.services) {
                const requiredUnits = remaining.get(svc.serviceCodeId);
                if (!requiredUnits) continue;

                if (svc.remainingUnits >= requiredUnits) {
                    remaining.delete(svc.serviceCodeId);
                }
            }
        }

        const minimumAuthorizations = candidateAuthorizations.filter(auth =>
            selectedAuthIds.has(auth.id)
        );

        const sessionPayload = new Session({ ...data, authorizationsUsed: minimumAuthorizations });
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

    approveSession = expressAsyncHandler(async (req, res) => {
        const session = await this.sessionService.getSingleSession(req.params.id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.clientApprovalStatus !== "APPROVED") {
            return res.status(404).json({ message: "client approval not granted" });
        }

        const data = { id: session.id, supervisorApprovalStatus: "APPROVED", supervisorId: req.params.supervisorId };

        const updatedSession = await this.sessionService.updateSession(data);

        if (!updatedSession) {
            return res.status(404).json({
                message: "Session not found or failed to approve",
            });
        }

        return res.status(200).json({
            message: "Session approved successfully",
            status: "ok",
            data: updatedSession,
        });
    });

    rejectSession = expressAsyncHandler(async (req, res) => {
        const data = { id: req.params.id, supervisorApprovalStatus: "REJECTED" };

        const updatedSession = await this.sessionService.updateSession(data);

        if (!updatedSession) {
            return res.status(404).json({
                message: "Session not found or failed to reject",
            });
        }

        return res.status(200).json({
            message: "Session rejected successfully",
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
                clientName: `${s.appointment.client.firstName} ${s.appointment.client.lastName}`,
                sessionTypeName: s.appointment.session.name,
                clinician: s.appointment.clinicians?.map(c => c.fullName).join(", "),
                clientApprovalStatus: s.clientApprovalStatus,
                supervisorApprovalStatus: s.supervisorApprovalStatus,
                totalHours,
                date: s.createdAt
            };
        });

        return res.status(200).json({
            message: "Sessions fetched successfully",
            status: "ok",
            data: formatted,
        });
    });

    getClaims = expressAsyncHandler(async (req, res) => {
        const sessions = await this.sessionService.getClaims(req.params.tenantId);

        if (!sessions) {
            return res.status(404).json({ message: "No claims found" });
        }

        const formatted = sessions.map((s) => {
            const totalHours =
                (new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60 * 60);

            return {
                id: s.id,
                clientName: `${s.appointment.client.firstName} ${s.appointment.client.lastName}`,
                sessionTypeName: s.appointment.session.name,
                clinician: s.appointment.clinicians?.map(c => c.fullName).join(", "),
                clientApprovalStatus: s.clientApprovalStatus,
                supervisorApprovalStatus: s.supervisorApprovalStatus,
                totalHours,
                date: s.createdAt,
                authorizationsUsed: s.authorizationsUsed,
                approver: s.approver
            };
        });

        return res.status(200).json({
            message: "claims fetched successfully",
            status: "ok",
            data: formatted,
        });
    });
}

export default SessionController;
