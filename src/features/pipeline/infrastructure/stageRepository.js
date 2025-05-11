import BaseRepository from "./baseRepository.js";

class StageRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async incrementOrdersBetween(startOrder, endOrder, pipelineId) {
        return await this.model.updateMany({
            where: { AND: [{ order: { gte: startOrder, lte: endOrder } }, { pipelineId: pipelineId }] },
            data: { order: { increment: 1 } }
        });
    }

    async decrementOrdersBetween(startOrder, endOrder, pipelineId) {
        return await this.model.updateMany({
            where: { AND: [{ order: { gte: startOrder, lte: endOrder } }, { pipelineId: pipelineId }] },
            data: { order: { decrement: 1 } }
        });
    }

    async findLast(pipelineId) {
        return await this.model.findFirst({
            where: { pipelineId },
            orderBy: { order: 'desc' },
        });
    }
}

export default StageRepository;