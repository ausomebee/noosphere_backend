import BaseRepository from "./baseRepository.js";

class ClientAuthorizationRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async txCreate(data, tx) {
        return tx.clientAuthorization.create({ data });
    }

    async countAllClientAuthorizations() {
        return this.model.count();
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    async getClientAuthorizationsByStatus(tenantId, broadWhere) {
        return await this.model.findMany({
            where: {
                ...broadWhere,
                isActive: true,
                isDeleted: false,
                tenantClient: {
                    tenantId,
                },
            },
            include: {
                tenantClient: true,
                payerDetails: true,
                insurance: true,
            },
        });
    }

    async countAuthorizationStatsByTenant(tenantId) {
        return await this.model.findMany({
            where: {
                isDeleted: false,
                isActive: true,
                tenantClient: {
                    tenantId,
                },
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
            },
        });
    }
}

export default ClientAuthorizationRepository;
