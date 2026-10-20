import BaseRepository from "./baseRepository.js";

class PipelineSubmittedDocumentRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findByPipelineItem(pipelineItemId) {
        return await this.model.findMany({
            where: { pipelineItemId }
        });
    }

    async verifyDocument(id) {
        return await this.model.update({
            where: { id },
            data: {
                isVerified: true
            }
        });
    }

    async unverifyDocument(id) {
        return await this.model.update({
            where: { id },
            data: {
                isVerified: false
            }
        });
    }

    async deleteByPipelineItem(pipelineItemId) {
        return await this.model.deleteMany({
            where: { pipelineItemId }
        });
    }
}

export default PipelineSubmittedDocumentRepository;