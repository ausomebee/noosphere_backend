class Pipeline {
    constructor({ id, module, name, description, createdByAdminId, createdByTenantId, isActive, pipelineId, tasks, order, tenantId, clientId, pipelineStageId, doneTasks }) {
        this.id = id;
        this.module = module;
        this.name = name;
        this.description = description;
        this.createdByAdminId = createdByAdminId;
        this.createdByTenantId = createdByTenantId;
        this.isActive = isActive;
        this.pipelineId = pipelineId;
        this.tasks = tasks;
        this.order = order;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.pipelineStageId = pipelineStageId;
        this.doneTasks = doneTasks;
    }

    get tenantPipeline() {
        return {
            module: "TENANT",
            name: this.name,
            description: this.description,
            createdByAdminId: this.createdByAdminId,
        };
    }

    get internalPipeline() {
        return {
            module: "CLIENT",
            name: this.name,
            description: this.description,
            createdByTenantId: this.createdByTenantId,
        };
    }

    get createPipelineStage() {
        return {
            pipelineId: this.pipelineId,
            tasks: this.tasks,
            name: this.name,
            order: this.order,
        };
    }

    get createPipelineItem() {
        return {
            clientId: this.clientId,
            pipelineStageId: this.pipelineStageId,
            tenantId: this.tenantId,
            doneTasks: this.doneTasks,
        };
    }
}

export default Pipeline;