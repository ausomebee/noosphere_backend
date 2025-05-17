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
    
}

export default FeatureRepository;