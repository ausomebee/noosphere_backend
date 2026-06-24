import BaseRepository from "./baseRepository.js";

class TenantRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.tenant.create({ data });
    }

    async countAllTenants() {
        return await this.model.count({
            where: {
                active: true,
                isDeleted: false
            }
        });
    }

    async countPaidTenants() {
        return await this.model.count({
            where: {
                isDeleted: false,
                Subscription: {
                    some: { status: 'ACTIVE' }
                }
            }
        });
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: {
                ...filter,
                isDeleted: false
            },
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

    async findAllWithActiveSubscription() {
        return await this.model.findMany({
            where: {
                active: true,
                isDeleted: false,
                Subscription: {
                    some: { status: 'ACTIVE' }
                }
            },
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
                }
            }
        });

        if (!tenant) {
            return {
                tenantClientsCount: 0,
                serverRequestsCount: 0
            };
        }

        return {
            tenantClientsCount: tenant._count.clientLinks,
            serverRequestsCount: tenant._count.serverRequests,
        };
    }
}

export default TenantRepository;
