import BaseRepository from "./baseRepository.js";

class TenantRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.tenant.create({ data });
    }

    async countAllTenants() {
        return await this.model.count();
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                BillingPlan: {
                    select: {
                        planType: true
                    }
                },
                Subscription: {
                    include: { plan: true }
                },
                accountOfficer: {
                    select: { firstName: true, lastName: true }
                },
                admin: {
                    select: { firstName: true, lastName: true }
                },
            }
        });
    }

    async findOneAndPopulate(filter = {}) {
        return await this.model.findUnique({
            where: filter,
            include: {
                BillingPlan: {
                    select: {
                        planType: true
                    }
                },
                Subscription: {
                    include: { plan: true }
                },
                accountOfficer: {
                    select: { firstName: true, lastName: true }
                },
                admin: {
                    select: { firstName: true, lastName: true }
                },
                pipelineItems: {
                    select: {
                        id: true,
                        pipelineStageId: true
                    }
                },
                _count: {
                    select: {
                        clientLinks: true
                    }
                },
                Invoice: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1,
                    select: {
                        id: true
                    }
                }
            }
        });
    }

    async getTenantRelationsCount(tenantId) {
        const tenant = await this.model.findUnique({
            where: { id: tenantId },
            select: {
                _count: {
                    select: {
                        clientLinks: true,
                        serverRequests: true,
                    }
                },
            },
        });

        return {
            tenantClientsCount: tenant._count.clientLinks,
            serverRequestsCount: tenant._count.serverRequests,
        };
    }
}

export default TenantRepository;