import BaseRepository from "./baseRepository.js";

class FeatureRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async updateWithGroup(featureGroupId, data) {
        return await this.model.updateMany({
            where: { featureGroupId },
            data,
        });
    }

    async findActivePlanUsage(id) {
        return await this.model.findFirst({
            where: {
                id,
                plans: {
                    some: {
                        active: true,
                        subscriptions: {
                            some: {
                                status: "ACTIVE",
                                tenant: {
                                    active: true,
                                    isDeleted: false
                                }
                            }
                        }
                    }
                }
            },
            select: {
                plans: {
                    where: {
                        active: true,
                        subscriptions: {
                            some: {
                                status: "ACTIVE",
                                tenant: {
                                    active: true,
                                    isDeleted: false
                                }
                            }
                        }
                    },
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async moveToExtraFeatures(id, featureGroupId) {
        const feature = await this.model.findUnique({
            where: { id },
            include: {
                plans: {
                    select: { id: true }
                }
            }
        });

        if (!feature) {
            return null;
        }

        return await this.model.update({
            where: { id },
            data: {
                featureGroupId,
                plans: {
                    disconnect: feature.plans
                },
                extraPlans: {
                    connect: feature.plans
                }
            },
            include: {
                plans: true,
                extraPlans: true,
                featureGroup: true
            }
        });
    }

    async findAllWithPlan() {
        return await this.model.findMany({
            where: {},
            include: {
                plans: {
                    select: {
                        name: true
                    }
                }
            }
        });
    }

}

export default FeatureRepository;
