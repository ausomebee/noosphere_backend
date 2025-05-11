import Pipeline from "../domain/pipeline.js";

class PipelineService {
    constructor({ pipelineRepository, stageRepository, itemRepository }) {
        this.pipelineRepository = pipelineRepository;
        this.stageRepository = stageRepository;
        this.itemRepository = itemRepository
    }

    async createPipeline(data) {
        const pipelineExist = await this.pipelineRepository.findFirst({
            AND: [
                { name: data.name },
                { module: data.module }
            ]
        });

        if (pipelineExist) {
            throw new Error("This pipeline already exists.");
        }

        const createData = new Pipeline(data).createPipeline
        const newPipeline = await this.pipelineRepository.create(createData);

        if (!newPipeline) {
            throw new Error("Failed to create pipelne");
        }

        return newPipeline;
    }

    async getPipelinesByModule(module) {
        const pipelines = await this.pipelineRepository.findByModule(module);

        if (!pipelines) {
            throw new Error("Failed to fetch pipelines.");
        }

        return pipelines;
    }

    async getPipelinesByTenantId(tenantId) {
        const pipelines = await this.pipelineRepository.findAll({ createdByTenantId: tenantId });

        if (!pipelines) {
            throw new Error("Failed to fetch pipelines.");
        }

        return pipelines;
    }

    async updatePipeline(data) {
        const pipeline = await this.pipelineRepository.findOne({ id: data.id })

        if (!pipeline) {
            throw new Error("Pipeline not found");
        }

        const update = await this.pipelineRepository.update(data.id, {
            name: data.name || pipeline.name,
            description: data.description || pipeline.description,
            isActive: data.isActive ?? pipeline.isActive
        });

        if (!update) {
            throw new Error("Failed to update pipeline");
        }

        return update;
    }

    async createStage(data) {
        const stageExist = await this.stageRepository.findFirst({
            AND: [
                { name: data.name },
                { pipelineId: data.pipelineId }
            ]
        });

        if (stageExist) {
            throw new Error("This stage already exists.");
        }

        const lastStage = await this.stageRepository.findLast(data.pipelineId);
        data.order = lastStage ? lastStage.order + 1 : 1;

        const createData = new Pipeline(data).createStage
        const newStage = await this.stageRepository.create(createData);

        if (!newStage) {
            throw new Error("Failed to create stage");
        }

        return newStage;
    }

    async getStageByPipelineId(pipelineId) {
        const stages = await this.stageRepository.findAll({ pipelineId: pipelineId });

        if (!stages) {
            throw new Error("Failed to fetch stages.");
        }

        return stages;
    }

    async getStageById(id) {
        const stage = await this.stageRepository.findOne({ id: id });

        if (!stage) {
            throw new Error("Failed to fetch stage.");
        }

        return stage;
    }

    async updateStage(data) {
        const stage = await this.stageRepository.findOne({ id: data.id })

        if (!stage) {
            throw new Error("Stage not found");
        }

        if (data.order && (data.order != stage.order)) {
            if (data.order < stage.order) {
                await this.stageRepository.incrementOrdersBetween(data.order, stage.order - 1);
            } else {
                await this.stageRepository.decrementOrdersBetween(stage.order + 1, data.order);
            }
        }

        const update = await this.stageRepository.update(data.id, {
            name: data.name || stage.name,
            description: data.description || stage.description,
            isActive: data.isActive ?? stage.isActive,
            tasks: data.tasks || stage.tasks,
            documents: data.documents || stage.documents,
            colourCode: data.colourCode || stage.colourCode,
            order: data.order || stage.order
        });

        if (!update) {
            throw new Error("Failed to update stage");
        }

        return update;
    }

    async createPipelineItem(data) {
        const itemExist = await this.itemRepository.findFirst({
            AND: [
                { pipelineStageId: data.pipelineStageId },
                { OR: [{ tenantId: data.tenantId }, { clientId: data.clientId }] }
            ]
        });

        if (itemExist) {
            throw new Error("This pipeline item already exists.");
        }

        const createData = new Pipeline(data).createPipelineItem
        const newPipelineItem = await this.itemRepository.create(createData);

        if (!newPipelineItem) {
            throw new Error("Failed to create pipelne");
        }

        return newPipelineItem;
    }

    async getItemByStageId(pipelineStageId) {
        const items = await this.itemRepository.findAll({ pipelineStageId: pipelineStageId });

        if (!items) {
            throw new Error("Failed to fetch items.");
        }

        return items;
    }

    async getItemById(id) {
        const item = await this.itemRepository.findOne({ id: id });

        if (!item) {
            throw new Error("Failed to fetch item.");
        }

        return item;
    }

    async updateItem(data) {
        const item = await this.itemRepository.findOne({ id: data.id })

        if (!item) {
            throw new Error("Item not found");
        }

        const update = await this.itemRepository.update(data.id, {
            pipelineStageId: data.pipelineStageId || item.pipelineStageId,
            assignToStaff: data.assignToStaff || item.assignToStaff,
            doneTasks: data.doneTasks || item.doneTasks,
            sentDocuments: data.sentDocuments || item.sentDocuments
        });
        
        if (!update) {
            throw new Error("Failed to update item");
        }

        return update;
    }
    
}

export default PipelineService;