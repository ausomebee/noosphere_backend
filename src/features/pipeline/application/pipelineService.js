import Pipeline from "../domain/pipeline.js";

class PipelineService {
    constructor({ pipelineRepository, stageRepository, itemRepository, tenantRepository }) {
        this.pipelineRepository = pipelineRepository;
        this.stageRepository = stageRepository;
        this.itemRepository = itemRepository;
        this.tenantRepository = tenantRepository;
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
                await this.stageRepository.incrementOrdersBetween(data.order, stage.order - 1, stage.pipelineId);
            } else {
                await this.stageRepository.decrementOrdersBetween(stage.order + 1, data.order, stage.pipelineId);
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

    async getItemByStageIdTenant(pipelineStageId) {
        const items = await this.itemRepository.findAllAndPopulate({ pipelineStageId: pipelineStageId }, {
            tenant: {
                select: {
                    companyName: true,
                    createdAt: true,
                    admin: {
                        select: {
                            fullName: true
                        }
                    }
                }
            }, admin: {
                select: {
                    fullName: true
                }
            }
        });

        if (!items) {
            throw new Error("Failed to fetch items.");
        }

        if (items.length === 0) {
            return [];
        }

        const stage = await this.stageRepository.findOne({ id: items[0]?.pipelineStageId })

        if (!stage) {
            throw new Error("Failed to fetch stage.");
        }

        // const updatedItems = items.map(item => {
        //     const totalTasks = stage.tasks.length;
        //     const completedTasks = stage.tasks?.filter(task => item.doneTasks && item.doneTasks[task.name] === true).length;

        //     const completionPercentage = (completedTasks / totalTasks) * 100;

        //     return {
        //         ...item,
        //         completionPercentage
        //     };
        // });

        return items;
    }

    async getItemByStageIdClient(pipelineStageId) {
        const items = await this.itemRepository.findAllAndPopulate({ pipelineStageId: pipelineStageId }, {
            client: {
                select: {
                    id: true,
                    preferredName: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    tenantLinks: {
                        select: {
                            tenantStaff: {
                                select: {
                                    fullName: true
                                }
                            }
                        }
                    }
                }
            }, tenantStaff: {
                select: {
                    fullName: true
                }
            }
        });

        if (!items) {
            throw new Error("Failed to fetch items.");
        }

        if (items.length === 0) {
            return [];
        }

        const stage = await this.stageRepository.findOne({ id: items[0]?.pipelineStageId })

        if (!stage) {
            throw new Error("Failed to fetch stage.");
        }

        // const updatedItems = items.map(item => {
        //     const totalTasks = stage.tasks.length;
        //     const completedTasks = stage.tasks?.filter(task => item.doneTasks && item.doneTasks[task.name] === true).length;

        //     const completionPercentage = (completedTasks / totalTasks) * 100;

        //     return {
        //         ...item,
        //         completionPercentage
        //     };
        // });

        return items;
    }

    async getItemById(id) {
        const item = await this.itemRepository.findOneAndPopulate({ id: id }, {
            tenant: true, admin: true
        });

        if (!item) {
            throw new Error("Failed to fetch item.");
        }

        return item;
    }

    async getItemByIdClient(id) {
        const item = await this.itemRepository.findOneAndPopulate({ id: id }, {
            client: true, tenantStaff: true
        });

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

        const mergeArraysByKey = (a = {}, b = {}) => {
            const result = { ...a };

            for (const key in b) {
                if (Array.isArray(result[key])) {
                    result[key] = [...result[key], ...b[key]];
                } else {
                    result[key] = b[key];
                }
            }

            return result;
        };

        const update = await this.itemRepository.update(data.id, {
            pipelineStageId: data.pipelineStageId || item.pipelineStageId,
            assignToAdmin: data.assignToAdmin || item.assignToAdmin,
            assignToTenantStaff: data.assignToTenantStaff || item.assignToTenantStaff,
            doneTasks: data.doneTasks || item.doneTasks,
            sentDocuments: mergeArraysByKey(data.sentDocuments, item.sentDocuments)
        });

        if (!update) {
            throw new Error("Failed to update item");
        }

        return update;
    }

    async deleteStage(id) {
        const stage = await this.stageRepository.findOne({ id })
        const items = await this.itemRepository.findAll({ pipelineStageId: stage.pipelineStageId })

        if (stage.order === 1 && items.length > 0) {
            throw new Error("Kindly remove all items");
        }

        const lastStage = await this.stageRepository.findLast(stage.pipelineId);
        const increment = await this.stageRepository.incrementOrdersBetween(stage.order, lastStage.order - 1, stage.pipelineId);

        if (!increment) {
            throw new Error("Failed to adjust order");
        }

        if (items.length > 0) {
            const firstStage = await this.stageRepository.findFirst({ AND: [{ pipelineId: stage.pipelineId }, { order: 1 }] })
            const update = await this.itemRepository.updateManyByPipelineStageId(stage.pipelineStageId, { pipelineStageId: firstStage.id })

            if (update.count < 1) {
                throw new Error("Failed to adjust order");
            }
        }

        const deleted = await this.stageRepository.delete(id);

        if (!deleted) {
            throw new Error("Failed to delete stage");
        }

        return deleted;
    }

    async deleteTenantPipelineItem(id) {
        const item = await this.itemRepository.findFirst({ id })

        if (!item) {
            throw new Error("item not found.");
        }

        const tenant = await this.tenantRepository.findOne({ id: item.tenantId })

        if (!tenant) {
            throw new Error("tenant not found.");
        }

        const updated = await this.tenantRepository.update(tenant.id, {
            active: false,
            stage: "UNVERIFIED"
        })

        if (!updated) {
            throw new Error("Failed to update tenant");
        }

        const deleted = await this.itemRepository.delete(id);

        if (!deleted) {
            throw new Error("Failed to delete item");
        }

        return deleted;
    }

    async deleteClientPipelineItem(id) {
        const item = await this.itemRepository.findFirst({ id })

        if (!item) {
            throw new Error("item not found.");
        }

        const deleted = await this.itemRepository.delete(id);

        if (!deleted) {
            throw new Error("Failed to delete item");
        }

        return deleted;
    }

    async moveToClient(id) {
        const item = await this.itemRepository.findFirst({ id })

        if (!item) {
            throw new Error("item not found.");
        }

        const deleted = await this.itemRepository.delete(id);

        if (!deleted) {
            throw new Error("Failed to delete item");
        }

        return deleted;
    }

    async deleteMultipleTenantPipelineItems({ ids }) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("No item IDs provided.");
        }

        const results = await Promise.all(
            ids.map(async (id) => {
                const item = await this.itemRepository.findFirst({ id });
                if (!item) throw new Error(`Item ${id} not found.`);

                const tenant = await this.tenantRepository.findOne({ id: item.tenantId });
                if (!tenant) throw new Error(`Tenant ${item.tenantId} not found.`);

                const updated = await this.tenantRepository.update(tenant.id, {
                    active: false,
                    stage: "UNVERIFIED",
                    isDeleted: true
                });
                if (!updated) throw new Error(`Failed to update tenant ${tenant.id}`);

                const deleted = await this.itemRepository.delete(id);
                if (!deleted) throw new Error(`Failed to delete item ${id}`);

                return { id, status: 'success' };
            })
        );

        return results;
    }

    async moveMultipleTenantPipelineItems(data) {
        if (!Array.isArray(data.ids) || data.ids.length === 0) {
            throw new Error("No item IDs provided.");
        }

        const results = await Promise.all(
            data.ids.map(async (id) => {
                const item = await this.itemRepository.findFirst({ id });
                if (!item) throw new Error(`Item ${id} not found.`);

                const update = await this.itemRepository.update(id, {
                    pipelineStageId: data.pipelineStageId || item.pipelineStageId
                });

                if (!update) throw new Error(`Failed to move item ${id}`);

                return { id, status: 'success' };
            })
        );

        return results;
    }

    async assignMultipleTenantPipelineItems(data) {
        if (!Array.isArray(data.ids) || data.ids.length === 0) {
            throw new Error("No item IDs provided.");
        }

        const results = await Promise.all(
            data.ids.map(async (id) => {
                const item = await this.itemRepository.findFirst({ id });
                if (!item) throw new Error(`Item ${id} not found.`);

                const update = await this.itemRepository.update(id, {
                    assignToAdmin: data.assignToAdmin || item.assignToAdmin,
                });

                if (!update) throw new Error(`Failed to assign item ${id}`);

                return { id, status: 'success' };
            })
        );

        return results;
    }
}

export default PipelineService;