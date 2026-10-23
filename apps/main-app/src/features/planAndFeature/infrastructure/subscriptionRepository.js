import BaseRepository from "./baseRepository.js";

class SubscriptionRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    // async findAllAndPopulate(query, populate) {
    //     return await this.model.findMany({
    //         where: query,
    //         include: populate
    //     });
    // }

    async totalCount(query) {
        return await this.model.aggregate({
            where: query,
            _count: {
                _all: true,
            },
        });
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                tenant: {
                    include: {
                        pipelineItems: {
                            select: {
                                id: true,
                                pipelineStageId: true
                            }
                        }
                    }
                },
                plan: {
                    select: {
                        name: true
                    }
                },
                payment: true
            }
        });
    }

    async getTenantSubscriptionsWithDetails(tenantId) {
        const subscriptions = await this.model.findMany({
            where: { tenantId },
            include: {
                plan: {
                    include: {
                        features: true,
                        extraFeatures: true,
                    },
                },
                tenant: {
                    select: {
                        _count: {
                            select: { clientLinks: true },
                        },
                        pipelineItems: {
                            select: {
                                id: true,
                                pipelineStageId: true
                            }
                        },
                    },
                },
            },
        });

        const formatted = subscriptions.map((sub) => ({
            ...sub,
            clientCount: sub.tenant._count.clientLinks,
        }));

        return formatted;
    }
}

export default SubscriptionRepository;