class Pipeline {
    constructor({ id, module, name, description, createdByAdminId, createdByTenantId, isActive, pipelineId, tasks, order, tenantId, clientId, pipelineStageId, doneTasks, documents, colourCode, assignToAdmin, assignToTenantStaff }) {
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
        this.documents = documents;
        this.colourCode = colourCode;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.pipelineStageId = pipelineStageId;
        this.doneTasks = doneTasks;
        this.assignToAdmin = assignToAdmin;
        this.assignToTenantStaff = assignToTenantStaff;
    }

    get createPipeline() {
        return {
            module: this.module,
            name: this.name,
            description: this.description,
            createdByAdminId: this.createdByAdminId,
            createdByTenantId: this.createdByTenantId
        };
    }

    get createStage() {
        return {
            pipelineId: this.pipelineId,
            tasks: this.tasks,
            documents: this.documents,
            name: this.name,
            colourCode: this.colourCode,
            order: this.order,
            description: this.description
        };
    }

    get createPipelineItem() {
        return {
            tenantId: this.tenantId,
            clientId: this.clientId,
            pipelineStageId: this.pipelineStageId,
            assignToAdmin: this.assignToAdmin
        };
    }
}

export default Pipeline;