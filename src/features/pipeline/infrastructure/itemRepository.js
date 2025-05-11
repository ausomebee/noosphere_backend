import BaseRepository from "./baseRepository.js";

class ItemRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.PipelineItem.create({ data });
    }

    async updateManyByPipelineStageId(pipelineStageId, data) {
        return await this.model.updateMany({
            where: { pipelineStageId },
            data,
        });
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }
}

export default ItemRepository;