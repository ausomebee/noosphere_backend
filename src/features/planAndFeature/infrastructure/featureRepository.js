import BaseRepository from "./baseRepository.js";

class FeatureRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async updateWithGroup(featureGroupId, data) {
        return await this.model.update({
            where: { featureGroupId },
            data,
        });
    }
    
}

export default FeatureRepository;