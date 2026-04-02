import BaseRepository from "./baseRepository.js";

class ClientAuthorizationServiceRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate,
        });
    }

    async getClientServices(tenantClientId) {
        return await this.model.findMany({
            where: {
                clientAuthorization: {
                    tenantClientId: tenantClientId,
                    isDeleted: false,
                    isActive: true,
                },
            },
            include: {
                serviceCode: true,
            },
        });
    }
}

export default ClientAuthorizationServiceRepository;
