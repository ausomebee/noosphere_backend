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
}

export default SessionService;
