import BaseRepository from "../../billing/infrastructure/baseRepository.js";

class FeatureGroupRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
    
}

export default FeatureGroupRepository;