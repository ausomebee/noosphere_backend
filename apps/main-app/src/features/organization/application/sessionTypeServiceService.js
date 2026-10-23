class SessionTypeServiceService {
    constructor({ sessionTypeServiceRepository }) {
        this.sessionTypeServiceRepository =
            sessionTypeServiceRepository;
    }

    async createSessionTypeService(data) {
        const exists =
            await this.sessionTypeServiceRepository.findFirstDynamic({
                where: {
                    serviceCodeId: data.serviceCodeId,
                    sessionTypeId: data.sessionTypeId,
                },
                select: { id: true },
            });

        if (exists) {
            return exists;
        }

        const newRecord =
            await this.sessionTypeServiceRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create session type service");
        }

        return newRecord;
    }

    async updateSessionTypeService(data) {
        const record =
            await this.sessionTypeServiceRepository.findOne({
                id: data.id,
            });

        if (!record) {
            throw new Error("Session type service not found");
        }

        const update =
            await this.sessionTypeServiceRepository.update(data.id, {
                modifiers: data.modifiers || record.modifiers,
                serviceCodeId:
                    data.serviceCodeId || record.serviceCodeId,
                sessionTypeId:
                    data.sessionTypeId || record.sessionTypeId,
            });

        if (!update) {
            throw new Error(
                "Failed to update session type service"
            );
        }

        return update;
    }

    async getSingleSessionTypeService(id) {
        const record =
            await this.sessionTypeServiceRepository.findOne({ id });

        if (!record) {
            throw new Error("Session type service not found");
        }

        return record;
    }

    async getSessionTypeServices(sessionTypeId) {
        const records =
            await this.sessionTypeServiceRepository.findAllAndPopulate(
                { sessionTypeId },
                { serviceCode: true }
            );

        if (!records) {
            throw new Error("Session type services not found");
        }

        return records;
    }
}

export default SessionTypeServiceService;
