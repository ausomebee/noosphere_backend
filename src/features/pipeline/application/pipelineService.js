import PipelineRepository from "../infrastructure/pipelineRepository.js";

class PipelineService {
    constructor() {
        this.repository = new PipelineRepository()
    }

    async tenantPipeline(data) {
        const pipelineExist = await this.repository.findFirst({
            OR: [
                { name: data.name },
                { module: "ADMIN" }
            ]
        });

        if (pipelineExist) {
            throw new Error("This pipeline already exists.");
        }

        const newPipeline = await this.repository.create(data);

        if (!newPipeline) {
            throw new Error("Failed to create pipelne");
        }

        return newPipeline;
    }

    async internalPipeline(data) {
        const pipelineExist = await this.repository.findFirst({
            OR: [
                { name: data.name },
                { module: "CLIENT" },
                { createdByTenantId: data.tenantId }
            ]
        });

        if (pipelineExist) {
            throw new Error("This pipeline already exists.");
        }

        const newPipeline = await this.repository.create(data);

        if (!newPipeline) {
            throw new Error("Failed to create pipelne");
        }

        return newPipeline;
    }

    async createPipelineStage(data) {
        const stageExist = await this.repository.findFirstStage({
            OR: [
                { name: data.name },
                { order: data.order }
            ]
        });

        if (stageExist) {
            throw new Error("This stage already exists.");
        }

        const newStage = await this.repository.createStage(data);

        if (!newStage) {
            throw new Error("Failed to create stage");
        }

        return newStage;
    }

    async createPipelineItem(data) {
        console.log(data)
        const itemExist = await this.repository.findFirstItem({
            AND: [
                { tenantId: data.tenantId },
                {
                    pipelineStage: {
                        id: data.pipelineStageId
                    }
                },
                { clientId: data.clientId }
            ]
        });

        if (itemExist) {
            throw new Error("This item already exists.");
        }

        const newItem = await this.repository.createItem(data);

        if (!newItem) {
            throw new Error("Failed to create item");
        }

        return newItem;
    }
}

export default PipelineService;