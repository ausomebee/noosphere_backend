import BaseRepository from "./baseRepository.js";

class PipelineRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async findByModule(module) {
        return await this.model.findMany({
            where: { module: module },
        });
    }

    async txCreate(data, tx) {
        return await tx.Pipeline.create({ data });
    }

}

export default PipelineRepository;