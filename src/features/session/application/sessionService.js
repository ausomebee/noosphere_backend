class SessionService {
    constructor({ sessionRepository }) {
        this.sessionRepository = sessionRepository;
    }

    async createSession(data) {
        const exists = await this.sessionRepository.findFirstDynamic({
            where: {
                appointmentId: data.appointmentId,
                startTime: data.startTime,
                endTime: data.endTime
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("A session already exists with these details.");
        }

        const newSession = await this.sessionRepository.create(data);

        if (!newSession) {
            throw new Error("Failed to create session");
        }

        return newSession;
    }

    async updateSession(data) {
        const session = await this.sessionRepository.findOne({ id: data.id });

        if (!session) {
            throw new Error("Session not found");
        }

        const update = await this.sessionRepository.update(data.id, {
            note: data.note || session.note,
            startTime: data.startTime || session.startTime,
            endTime: data.endTime || session.endTime,
            travelStartTime: data.travelStartTime ?? session.travelStartTime,
            travelEndTime: data.travelEndTime ?? session.travelEndTime,
            supervisorApprovalStatus: data.supervisorApprovalStatus || session.supervisorApprovalStatus,
            clientApprovalStatus: data.clientApprovalStatus || session.clientApprovalStatus,
            supervisorId: data.supervisorId ?? session.supervisorId
        });

        if (!update) {
            throw new Error("Failed to update session");
        }

        return update;
    }

    async getSingleSession(id) {
        const session = await this.sessionRepository.findOneAndPopulate(id);

        if (!session) {
            throw new Error("Session not found");
        }

        return session;
    }

    async countTenantSessions(id) {
        const session = await this.sessionRepository.countTenantSessions(id);

        if (!session) {
            throw new Error("Session not found");
        }

        return session;
    }

    async getSessions(tenantId) {
        const sessions = await this.sessionRepository.findAllAndPopulate({ appointment: { tenantId: tenantId } }, {
            id: true,
            appointment: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            preferredName: true
                        }
                    },
                    session: { select: { name: true } },
                    clinicians: {
                        select: {
                            fullName: true,
                        },
                    }
                },
            },
            clientApprovalStatus: true,
            supervisorApprovalStatus: true,
            startTime: true,
            endTime: true,
            createdAt: true
        });

        if (!sessions) {
            throw new Error("Sessions not found");
        }

        return sessions;
    }

    async getSessionsAwaitingApproval(clientId) {
        const sessions = await this.sessionRepository.findAllAndPopulate({ appointment: { clientId: clientId }, clientApprovalStatus: "PENDING" }, {
            id: true,
            appointment: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            preferredName: true
                        }
                    },
                    session: { select: { name: true } },
                    clinicians: {
                        select: {
                            fullName: true,
                        },
                    }
                },
            },
            clientApprovalStatus: true,
            supervisorApprovalStatus: true,
            startTime: true,
            endTime: true,
            createdAt: true
        });

        if (!sessions) {
            throw new Error("Sessions not found");
        }

        return sessions;
    }

    async getClaims(tenantId) {
        const sessions = await this.sessionRepository.findAllAndPopulate({ appointment: { tenantId: tenantId }, supervisorApprovalStatus: "APPROVED" }, {
            id: true,
            appointment: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            preferredName: true

                        }
                    },
                    session: { select: { name: true } },
                    clinicians: {
                        select: {
                            fullName: true,
                        },
                    }
                },
            },
            clientApprovalStatus: true,
            supervisorApprovalStatus: true,
            startTime: true,
            approver: { select: { fullName: true } },
            endTime: true,
            createdAt: true,
            authorizationsUsed: { select: { payerDetails: { select: { payerName: true } } } }
        });

        if (!sessions) {
            throw new Error("Sessions not found");
        }

        return sessions;
    }

    async getClientSessionOverview(id) {
        const completedSession = await this.sessionRepository.countClientSessions(id);
        const avgSession = await this.sessionRepository.avgSessionDuration(id);
        const awaitingApproval = await this.sessionRepository.countClientAwaitingApproval(id);

        if (
            completedSession == null ||
            avgSession == null ||
            awaitingApproval == null
        ) {
            throw new Error("Failed to fetch session overview");
        }

        return {
            completedSession,
            avgSession,
            awaitingApproval
        };
    }

    async clientOverviewGraph(id, groupBy) {
        const session = await this.sessionRepository.getSessionCounts({
            clientId: id,
            groupBy,
        });

        if (!session) {
            throw new Error("Sessions not found");
        }

        return session;
    }

    async tenantOverviewGraph(id, groupBy) {
        const session = await this.sessionRepository.getTenantSessionCounts({
            tenantId: id,
            groupBy,
        });

        if (!session) {
            throw new Error("Sessions not found");
        }

        return session;
    }

    async getClientSessions(clientId) {
        const session = await this.sessionRepository.getClientSessions(clientId);

        if (!session) {
            throw new Error("Sessions not found");
        }

        return session;
    }

    async getClientAwaitingApproval(clientId, tenantId) {
        const sessions = await this.sessionRepository.findAllAndPopulate({ appointment: { tenantId: tenantId, clientId: clientId }, supervisorApprovalStatus: "PENDING" }, {
            id: true,
            appointment: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            preferredName: true

                        }
                    },
                    session: { select: { name: true } },
                    clinicians: {
                        select: {
                            fullName: true,
                        },
                    }
                },
            },
            clientApprovalStatus: true,
            supervisorApprovalStatus: true,
            startTime: true,
            approver: { select: { fullName: true } },
            endTime: true,
            createdAt: true,
            authorizationsUsed: { select: { payerDetails: { select: { payerName: true } } } }
        });

        if (!sessions) {
            throw new Error("Sessions not found");
        }

        return sessions;
    }

    async getSessionsByTargetId(targetId, clientId, tenantId) {
        const sessions = await this.sessionRepository.findAllAndPopulate({
            appointment: { tenantId: tenantId, clientId: clientId },
            sessionDatas: { some: { targetId: targetId } }
        }, {
            id: true,
            appointment: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            preferredName: true

                        }
                    },
                    session: { select: { name: true } },
                    clinicians: {
                        select: {
                            fullName: true,
                        },
                    }
                },
            },
            clientApprovalStatus: true,
            supervisorApprovalStatus: true,
            startTime: true,
            approver: { select: { fullName: true } },
            endTime: true,
            createdAt: true,
            authorizationsUsed: { select: { payerDetails: { select: { payerName: true } } } }
        });

        if (!sessions) {
            throw new Error("Sessions not found");
        }

        return sessions;
    }

    async getTargetPerformanceGraph(data) {
        const graph = await this.sessionRepository.getTargetPerformanceGraphData(data.targetId, data.clientId);

        if (!graph) {
            throw new Error("Session data not found");
        }

        return graph;
    }
}

export default SessionService;
