import BaseRepository from "./baseRepository.js";

class ItemRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.PipelineItem.create({ data });
    }
}

export default ItemRepository;