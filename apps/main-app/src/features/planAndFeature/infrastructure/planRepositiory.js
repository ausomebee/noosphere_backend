import BaseRepository from "./baseRepository.js";

class PlanRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: {
                ...populate,
                _count: {
                    select: {
                        subscriptions: true
                    }
                }
            }
        });
    }

    async findOneToDuplicate(query) {
        return await this.model.findUnique({
            where: query,
            include: {
                features: true,
                extraFeatures: true,
            }
        });
    }
}

export default PlanRepository;