import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientTargetRepository from "../../infrastructure/clientTargetRepository.js";
import ClientTargetService from "../../application/clientTargetService.js";
import ClientTarget from "../../domain/clientTarget.js";
import TargetRepository from "../../infrastructure/targetRepository.js";
import TargetService from "../../application/targetService.js";
import Target from "../../domain/target.js";

class ClientTargetController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientTargetRepository = new ClientTargetRepository(this.prisma.clientTarget)
        this.service = new ClientTargetService({ clientTargetRepository: this.clientTargetRepository });
        this.targetRepository = new TargetRepository(this.prisma.target)
        this.targetService = new TargetService({ targetRepository: this.targetRepository });
    }

    createClientTarget = expressAsyncHandler(async (req, res) => {
        const target = await this.targetService.getSingleTarget(req.body.targetId);

        if (!target) {
            return res.status(404).json({ message: "Target not found" });
        }

        const targetData = new Target({...target, isCustom: true});
        const newTarget = await this.targetService.createTarget(targetData.createTarget);

        if (!newTarget) {
            res.status(500).json({ message: 'Failed to create target' });
        }

        const clientTargetData = new ClientTarget({...req.body, targetId: newTarget.id});
        const clientTarget = await this.service.createClientTarget(clientTargetData.createClientTarget);

        if (!clientTarget) {
            res.status(500).json({ message: 'Failed to create client target' });
        }

        return res.status(201).json({
            message: "client target created successfully",
            status: 'ok',
            data: clientTarget
        });
    });

    getAllClientTargets = expressAsyncHandler(async (req, res) => {
        const clientTargets = await this.service.getAllClientTargets(req.params);

        if (!clientTargets) {
            res.status(500).json({ message: 'Failed to fetch client targets' });
        }

        return res.status(201).json({
            message: "client targets fetched successfully",
            status: 'ok',
            data: clientTargets
        });
    });

}

export default ClientTargetController;