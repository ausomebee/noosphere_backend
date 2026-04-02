class SessionDataService {
    constructor({ sessionDataRepository }) {
        this.sessionDataRepository = sessionDataRepository;
    }

    async createSessionData(data) {
        const exists = await this.sessionDataRepository.findFirstDynamic({
            where: { sessionId: data.sessionId, targetId: data.targetId },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Session data for this target already exists.");
        }

        const newData = await this.sessionDataRepository.create(data);

        if (!newData) {
            throw new Error("Failed to create session data");
        }

        return newData;
    }

    async updateSessionData(data) {
        const record = await this.sessionDataRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Session data not found");
        }

        const update = await this.sessionDataRepository.update(data.id, {
            data: data.data || record.data,
            targetId: data.targetId || record.targetId
        });

        if (!update) {
            throw new Error("Failed to update session data");
        }

        return update;
    }

    async getSingleSessionData(id) {
        const record = await this.sessionDataRepository.findOne({ id });

        if (!record) {
            throw new Error("Session data not found");
        }

        return record;
    }

    async getSessionData(sessionId) {
        const records = await this.sessionDataRepository.findAllAndPopulate(
            { sessionId },
            { target: true }
        );

        if (!records) {
            throw new Error("Session data not found");
        }

        return records;
    }
}

export default SessionDataService;
