import BaseRepository from "./baseRepository.js";

class ClientNotificationSettingsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findByClientId(clientId, populate = {}) {
        return await this.model.findFirst({
            where: { tenantClientId: clientId },
            include: populate
        });
    }
}

export default ClientNotificationSettingsRepository;
