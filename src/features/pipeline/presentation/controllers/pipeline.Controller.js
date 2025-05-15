import expressAsyncHandler from "express-async-handler";
import PipelineService from "../../application/pipelineService.js";
import PipelineRepository from "../../infrastructure/pipelineRepository.js";
import prismaService from "../../../../config/prisma.js";
import StageRepository from "../../infrastructure/stageRepository.js";
import ItemRepository from "../../infrastructure/itemRepository.js";
import TenantRepository from "../../../tenant/infrastructure/tenantRepository.js";

class PipelineController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.pipelineRepository = new PipelineRepository(this.prisma.pipeline)
        this.tenantRepository = new TenantRepository(this.prisma.tenant)
        this.stageRepository = new StageRepository(this.prisma.pipelineStage)
        this.itemRepository = new ItemRepository(this.prisma.pipelineItem)
        this.service = new PipelineService({ pipelineRepository: this.pipelineRepository, stageRepository: this.stageRepository, itemRepository: this.itemRepository, tenantRepository: this.tenantRepository });
    }

    createPipeline = expressAsyncHandler(async (req, res) => {
        const pipeline = await this.service.createPipeline(req.body);

        if (!pipeline) {
            res.status(500).json({ message: 'Failed to create pipeline' });
        }

        return res.status(201).json({
            message: "Pipeline created successfully",
            status: 'ok',
            data: pipeline
        });
    });

    getPipelinesByModule = expressAsyncHandler(async (req, res) => {
        const pipelines = await this.service.getPipelinesByModule(req.params.module);

        if (!pipelines) {
            res.status(500).json({ message: 'Failed to fetch pipelines' });
        }

        return res.status(201).json({
            message: "Pipelines fetched successfully",
            status: 'ok',
            data: pipelines
        });
    });

    getPipelinesByTenantId = expressAsyncHandler(async (req, res) => {
        const pipelines = await this.service.getPipelinesByTenantId(req.params.tenantId);

        if (!pipelines) {
            res.status(500).json({ message: 'Failed to fetch pipelines' });
        }

        return res.status(201).json({
            message: "Pipelines fetched successfully",
            status: 'ok',
            data: pipelines
        });
    });

    updatePipeline = expressAsyncHandler(async (req, res) => {
        const pipeline = await this.service.updatePipeline(req.body);

        if (!pipeline) {
            res.status(500).json({ message: 'Failed to update pipeline' });
        }

        return res.status(201).json({
            message: "Pipeline updated successfully",
            status: 'ok',
            data: pipeline
        });
    });

    createPipelineStage = expressAsyncHandler(async (req, res) => {
        const stage = await this.service.createStage(req.body);

        if (!stage) {
            res.status(500).json({ message: 'Failed to create stage' });
        }

        return res.status(201).json({
            message: "Stage created successfully",
            status: 'ok',
            data: stage
        });
    });

    getStageByPipelineId = expressAsyncHandler(async (req, res) => {
        const stages = await this.service.getStageByPipelineId(req.params.pipelineId);

        if (!stages) {
            res.status(500).json({ message: 'Failed to fetch stages' });
        }

        return res.status(201).json({
            message: "Stages fetched successfully",
            status: 'ok',
            data: stages
        });
    });

    getStageById = expressAsyncHandler(async (req, res) => {
        const stage = await this.service.getStageById(req.params.id);

        if (!stage) {
            res.status(500).json({ message: 'Failed to fetch stage' });
        }

        return res.status(201).json({
            message: "Stage fetched successfully",
            status: 'ok',
            data: stage
        });
    });

    updateStage = expressAsyncHandler(async (req, res) => {
        const stage = await this.service.updateStage(req.body);

        if (!stage) {
            res.status(500).json({ message: 'Failed to update stage' });
        }

        return res.status(201).json({
            message: "Stage updated successfully",
            status: 'ok',
            data: stage
        });
    });

    createPipelineItem = expressAsyncHandler(async (req, res) => {
        const item = await this.service.createPipelineItem(req.body);

        if (!item) {
            res.status(500).json({ message: 'Failed to create item' });
        }

        return res.status(201).json({
            message: "Item created successfully",
            status: 'ok',
            data: item
        });
    });

    getItemByStageIdTenant = expressAsyncHandler(async (req, res) => {
        const items = await this.service.getItemByStageIdTenant(req.params.pipelineStageId);

        if (!items) {
            res.status(500).json({ message: 'Failed to fetch items' });
        }

        return res.status(201).json({
            message: "Items fetched successfully",
            status: 'ok',
            data: items
        });
    });

    getItemByStageIdClient = expressAsyncHandler(async (req, res) => {
        const items = await this.service.getItemByStageIdClient(req.params.pipelineStageId);

        if (!items) {
            res.status(500).json({ message: 'Failed to fetch items' });
        }

        return res.status(201).json({
            message: "Items fetched successfully",
            status: 'ok',
            data: items
        });
    });

    getItemById = expressAsyncHandler(async (req, res) => {
        const item = await this.service.getItemById(req.params.id);

        if (!item) {
            res.status(500).json({ message: 'Failed to fetch item' });
        }

        return res.status(201).json({
            message: "Item fetched successfully",
            status: 'ok',
            data: item
        });
    });

    updateItem = expressAsyncHandler(async (req, res) => {
        const item = await this.service.updateItem(req.body);

        if (!item) {
            res.status(500).json({ message: 'Failed to update item' });
        }

        return res.status(201).json({
            message: "Item updated successfully",
            status: 'ok',
            data: item
        });
    });

    deleteStage = expressAsyncHandler(async (req, res) => {
        const stage = await this.service.deleteStage(req.params.id);

        if (!stage) {
            res.status(500).json({ message: 'Failed to delete stage' });
        }

        return res.status(201).json({
            message: "Stage deleted successfully",
            status: 'ok',
            data: stage
        });
    });

    deleteTenantPipelineItem = expressAsyncHandler(async (req, res) => {
        const item = await this.service.deleteTenantPipelineItem(req.params.id);

        if (!item) {
            res.status(500).json({ message: 'Failed to delete item' });
        }

        return res.status(201).json({
            message: "Item deleted successfully",
            status: 'ok',
            data: item
        });
    });

    deleteMultipleTenantPipelineItems = expressAsyncHandler(async (req, res) => {
        const item = await this.service.deleteMultipleTenantPipelineItems(req.body);

        if (!item) {
            res.status(500).json({ message: 'Failed to delete items' });
        }

        return res.status(201).json({
            message: "Items deleted successfully",
            status: 'ok',
            data: item
        });
    });

    moveMultipleTenantPipelineItems = expressAsyncHandler(async (req, res) => {
        const item = await this.service.moveMultipleTenantPipelineItems(req.body);

        if (!item) {
            res.status(500).json({ message: 'Failed to move items' });
        }

        return res.status(201).json({
            message: "Items moved successfully",
            status: 'ok',
            data: item
        });
    });

    assignMultipleTenantPipelineItems = expressAsyncHandler(async (req, res) => {
        const item = await this.service.assignMultipleTenantPipelineItems(req.body);

        if (!item) {
            res.status(500).json({ message: 'Failed to assign items' });
        }

        return res.status(201).json({
            message: "Items assigned successfully",
            status: 'ok',
            data: item
        });
    });
}

export default PipelineController;