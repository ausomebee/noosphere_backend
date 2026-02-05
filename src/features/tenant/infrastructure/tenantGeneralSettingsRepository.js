import BaseRepository from "./baseRepository.js";

class TenantGeneralSettingsRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async findByTenantId(tenantId) {
        return await this.model.findUnique({
            where: { tenantId },
        });
    }
}

export default TenantGeneralSettingsRepository;
