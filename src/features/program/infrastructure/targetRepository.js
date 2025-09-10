import BaseRepository from "./baseRepository.js";

class TargetRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findOneAndPopulate(query, populate) {
        return await this.model.findFirst({
            where: query,
            include: populate
        });
    }
}

export default TargetRepository;