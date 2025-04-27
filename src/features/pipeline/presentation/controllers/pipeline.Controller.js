import expressAsyncHandler from "express-async-handler";
import PipelineService from "../../application/pipelineService.js";
import Pipeline from "../../domain/pipeline.js";

class PipelineController {
    constructor() {
        this.service = new PipelineService();
    }

    tenantPipeline = expressAsyncHandler(async (req, res) => {
        const pipelineData = new Pipeline(req.body);
        const pipeline = await this.service.tenantPipeline(pipelineData.tenantPipeline);

        if (!pipeline) {
            res.status(500).json({ message: 'Failed to create pipeline' });
        }

        return res.status(201).json({
            message: "Pipeline created successfully",
            status: 'ok',
            data: pipeline
        });
    });

    internalPipeline = expressAsyncHandler(async (req, res) => {
        const pipelineData = new Pipeline(req.body);
        const pipeline = await this.service.internalPipeline(pipelineData.internalPipeline);

        if (!pipeline) {
            res.status(500).json({ message: 'Failed to create pipeline' });
        }

        return res.status(201).json({
            message: "Pipeline created successfully",
            status: 'ok',
            data: pipeline
        });
    });

    createPipelineStage = expressAsyncHandler(async (req, res) => {
        const stageData = new Pipeline(req.body);
        const stage = await this.service.createPipelineStage(stageData.createPipelineStage);

        if (!stage) {
            res.status(500).json({ message: 'Failed to create stage' });
        }

        return res.status(201).json({
            message: "stage created successfully",
            status: 'ok',
            data: stage
        });
    });

    createPipelineItem = expressAsyncHandler(async (req, res) => {
        const itemData = new Pipeline(req.body);
        const item = await this.service.createPipelineItem(itemData.createPipelineItem);

        if (!item) {
            res.status(500).json({ message: 'Failed to create item' });
        }

        return res.status(201).json({
            message: "Item created successfully",
            status: 'ok',
            data: item
        });
    });
}

export default PipelineController;