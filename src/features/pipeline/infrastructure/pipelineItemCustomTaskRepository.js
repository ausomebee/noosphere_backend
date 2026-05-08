import BaseRepository from "./baseRepository.js";

class PipelineItemCustomTaskRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findByPipelineItem(pipelineItemId) {
        return await this.model.findMany({
            where: { pipelineItemId }
        });
    }

    async markAsCompleted(id) {
        return await this.model.update({
            where: { id },
            data: {
                isCompleted: true,
                completedAt: new Date()
            }
        });
    }

    async markAsIncomplete(id) {
        return await this.model.update({
            where: { id },
            data: {
                isCompleted: false,
                completedAt: null
            }
        });
    }

    async deleteByPipelineItem(pipelineItemId) {
        return await this.model.deleteMany({
            where: { pipelineItemId }
        });
    }
}

export default PipelineItemCustomTaskRepository;
