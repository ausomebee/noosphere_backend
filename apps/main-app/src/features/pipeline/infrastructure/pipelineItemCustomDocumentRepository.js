import BaseRepository from "./baseRepository.js";

class PipelineItemCustomDocumentRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findByPipelineItem(pipelineItemId) {
        return await this.model.findMany({
            where: { pipelineItemId }
        });
    }

    async deleteByPipelineItem(pipelineItemId) {
        return await this.model.deleteMany({
            where: { pipelineItemId }
        });
    }
}

export default PipelineItemCustomDocumentRepository;
