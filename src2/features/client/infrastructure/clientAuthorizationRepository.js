import BaseRepository from "./baseRepository.js";

class ClientAuthorizationRepository extends BaseRepository {
    constructor(model, clientAuthorizationServiceModel) {
        super(model);
        this.clientAuthorizationServiceModel = clientAuthorizationServiceModel;
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
                tenantClient: {
                    select: { client: true }
                },
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

    async getAuthorizationForTimesheet(tenantClientId, requiredServices) {
        return await this.model.findMany({
            where: {
                tenantClientId,
                isActive: true,
                isDeleted: false,
                clientAuthorizationServices: {
                    some: {
                        serviceCodeId: {
                            in: requiredServices.map(s => s.serviceCodeId),
                        },
                        units: {
                            gt: this.clientAuthorizationServiceModel.fields.usedUnit,
                        },
                    },
                },
            },
            include: {
                clientAuthorizationServices: {
                    where: {
                        serviceCodeId: {
                            in: requiredServices.map(s => s.serviceCodeId),
                        },
                    },
                    select: {
                        id: true,
                        serviceCodeId: true,
                        units: true,
                        usedUnit: true,
                    },
                },
            },
        });
    }
}

export default ClientAuthorizationRepository;
