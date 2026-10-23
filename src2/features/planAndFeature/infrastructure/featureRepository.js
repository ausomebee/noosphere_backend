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