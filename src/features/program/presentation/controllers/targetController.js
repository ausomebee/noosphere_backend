import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TargetRepository from "../../infrastructure/targetRepository.js";
import TargetService from "../../application/targetService.js";
import Target from "../../domain/target.js";

class TargetController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.targetRepository = new TargetRepository(this.prisma.target)
        this.service = new TargetService({ targetRepository: this.targetRepository });
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

}

export default TargetController;