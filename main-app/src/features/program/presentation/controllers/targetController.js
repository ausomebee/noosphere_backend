import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TargetRepository from "../../infrastructure/targetRepository.js";
import TargetService from "../../application/targetService.js";
import Target from "../../domain/target.js";
import ClientTarget from "../../domain/clientTarget.js";
import ClientTargetRepository from "../../infrastructure/clientTargetRepository.js";
import ClientTargetService from "../../application/clientTargetService.js";

class TargetController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.targetRepository = new TargetRepository(this.prisma.target)
        this.service = new TargetService({ targetRepository: this.targetRepository });
        this.clientTargetRepository = new ClientTargetRepository(this.prisma.clientTarget)
        this.clientTargetService = new ClientTargetService({ clientTargetRepository: this.clientTargetRepository });
    }

    createTarget = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            attachment: req.file.location
        } : req.body
        const targetData = new Target(data);
        const target = await this.service.createTarget(targetData.createTarget);

        if (!target) {
            res.status(500).json({ message: 'Failed to create target' });
        }

        return res.status(201).json({
            message: "target created successfully",
            status: 'ok',
            data: target
        });
    });

    createCustomTarget = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            attachment: req.file.location
        } : req.body
        const targetData = new Target(data);
        const target = await this.service.createTarget(targetData.createTarget);

        if (!target) {
            res.status(500).json({ message: 'Failed to create target' });
        }

        const clientTargetData = new ClientTarget({...req.body, targetId: target.id});
        const clientTarget = await this.clientTargetService.createClientTarget(clientTargetData.createClientTarget);

        if (!clientTarget) {
            res.status(500).json({ message: 'Failed to create client target' });
        }

        return res.status(201).json({
            message: "target created successfully",
            status: 'ok',
            data: target
        });
    });

    updateTarget = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            attachment: req.file.location
        } : req.body
        const target = await this.service.updateTarget(data);

        if (!target) {
            res.status(500).json({ message: 'Failed to update target' });
        }

        return res.status(201).json({
            message: "target updated successfully",
            status: 'ok',
            data: target
        });
    });

    getAllProgramTargets = expressAsyncHandler(async (req, res) => {
        const targets = await this.service.getAllProgramTargets(req.params.programId);

        if (!targets) {
            res.status(500).json({ message: 'Failed to fetch targets' });
        }

        return res.status(201).json({
            message: "targets fetched successfully",
            status: 'ok',
            data: targets
        });
    });

    getAllTenantTargets = expressAsyncHandler(async (req, res) => {
        const targets = await this.service.getAllTenantTargets(req.params.tenantId);

        if (!targets) {
            res.status(500).json({ message: 'Failed to fetch targets' });
        }

        return res.status(201).json({
            message: "targets fetched successfully",
            status: 'ok',
            data: targets
        });
    });

    deleteTarget = expressAsyncHandler(async (req, res) => {
        const target = await this.service.updateTarget({ id: req.params.id, isDeleted: true });

        if (!target) {
            res.status(500).json({ message: 'Failed to delete target' });
        }

        return res.status(201).json({
            message: "target deleted successfully",
            status: 'ok',
            data: target
        });
    });

    getTarget = expressAsyncHandler(async (req, res) => {
        const target = await this.service.getSingleTarget(req.params.id);

        if (!target) {
            res.status(500).json({ message: 'Failed to fetch target' });
        }

        return res.status(201).json({
            message: "target fetched successfully",
            status: 'ok',
            data: target
        });
    });

    findTargetWithFirstSessionData = expressAsyncHandler(async (req, res) => {
        const target = await this.service.findTargetWithFirstSessionData(req.params.targetId);

        if (!target) {
            res.status(500).json({ message: 'Failed to fetch target' });
        }

        return res.status(201).json({
            message: "target fetched successfully",
            status: 'ok',
            data: target
        });
    });

    duplicateTarget = expressAsyncHandler(async (req, res) => {
        const target = await this.service.duplicateTarget(req.params.id);

        if (!target) {
            res.status(500).json({ message: 'Failed to duplicate target' });
        }

        return res.status(201).json({
            message: "target duplicated successfully",
            status: 'ok',
            data: target
        });
    });

}

export default TargetController;