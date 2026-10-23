import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import FeatureRepository from "../../infrastructure/featureRepository.js";
import FeatureGroupRepository from "../../infrastructure/featureGroupRepository.js";
import FeatureService from "../../application/featureService.js";
import Feature from "../../domain/feature.js";
import AdminRepository from "../../../admin/infrastructure/adminRepository.js";

class FeatureController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.featureRepository = new FeatureRepository(this.prisma.feature)
        this.adminRepository = new AdminRepository(this.prisma.admin)
        this.featureGroupRepository = new FeatureGroupRepository(this.prisma.featureGroup)
        this.service = new FeatureService({ featureRepository: this.featureRepository, featureGroupRepository: this.featureGroupRepository, adminRepository: this.adminRepository });
    }

    createFeature = expressAsyncHandler(async (req, res) => {
        const featureData = new Feature(req.body);
        const feature = await this.service.createFeature(featureData.createFeature);

        if (!feature) {
            res.status(500).json({ message: 'Failed to create feature' });
        }

        return res.status(201).json({
            message: "feature created successfully",
            status: 'ok',
            data: feature
        });
    });

    updateFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.updateFeature(req.body);

        if (!feature) {
            res.status(500).json({ message: 'Failed to update feature' });
        }

        return res.status(201).json({
            message: "feature updated successfully",
            status: 'ok',
            data: feature
        });
    });

    getSingleFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.getSingleFeature(req.params);

        if (!feature) {
            res.status(500).json({ message: 'Failed to fetch feature' });
        }

        return res.status(201).json({
            message: "feature fetched successfully",
            status: 'ok',
            data: feature
        });
    });

    getAllFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.getAllFeature();

        if (!feature) {
            res.status(500).json({ message: 'Failed to fetch feature' });
        }

        return res.status(201).json({
            message: "feature fetched successfully",
            status: 'ok',
            data: feature
        });
    });

    createFeatureGroup = expressAsyncHandler(async (req, res) => {
        const featureGroupData = new Feature(req.body);
        const featureGroup = await this.service.createFeatureGroup(featureGroupData.createFeatureGroup);

        if (!featureGroup) {
            res.status(500).json({ message: 'Failed to create feature group' });
        }

        return res.status(201).json({
            message: "feature group created successfully",
            status: 'ok',
            data: featureGroup
        });
    });

    updateFeatureGroup = expressAsyncHandler(async (req, res) => {
        const featureGroup = await this.service.updateFeatureGroup(req.body);

        if (!featureGroup) {
            res.status(500).json({ message: 'Failed to update feature group' });
        }

        return res.status(201).json({
            message: "feature group updated successfully",
            status: 'ok',
            data: featureGroup
        });
    });

    getSingleFeatureGroup = expressAsyncHandler(async (req, res) => {
        const featureGroup = await this.service.getSingleFeatureGroup(req.params);

        if (!featureGroup) {
            res.status(500).json({ message: 'Failed to fetch feature group' });
        }

        return res.status(201).json({
            message: "feature group fetched successfully",
            status: 'ok',
            data: featureGroup
        });
    });

    getAllFeatureGroup = expressAsyncHandler(async (req, res) => {
        const featureGroup = await this.service.getAllFeatureGroup();

        if (!featureGroup) {
            res.status(500).json({ message: 'Failed to fetch feature group' });
        }

        return res.status(201).json({
            message: "feature group fetched successfully",
            status: 'ok',
            data: featureGroup
        });
    });

    deleteSingleFeatureGroup = expressAsyncHandler(async (req, res) => {
        const featureGroup = await this.service.deleteSingleFeatureGroup(req.body);

        if (!featureGroup) {
            res.status(500).json({ message: 'Failed to delete feature group' });
        }

        return res.status(201).json({
            message: "feature group deleted successfully",
            status: 'ok',
            data: featureGroup
        });
    });
    
    deleteSingleFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.deleteSingleFeature(req.body);

        if (!feature) {
            res.status(500).json({ message: 'Failed to move feature to extras group.' });
        }

        return res.status(201).json({
            message: "feature moved to extras group successfully",
            status: 'ok',
            data: feature
        });
    });
}

export default FeatureController;
