import BaseRepository from "./baseRepository.js";

class TenantNotificationSettingsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findByUserId(userId, populate = {}) {
        return await this.model.findFirst({
            where: { userId },
            include: populate
        });
    }
}

export default TenantNotificationSettingsRepository;