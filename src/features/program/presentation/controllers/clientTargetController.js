import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientTargetRepository from "../../infrastructure/clientTargetRepository.js";
import ClientTargetService from "../../application/clientTargetService.js";
import ClientTarget from "../../domain/clientTarget.js";

class ClientTargetController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientTargetRepository = new ClientTargetRepository(this.prisma.clientTarget)
        this.service = new ClientTargetService({ clientTargetRepository: this.clientTargetRepository });
    }

    createClientTarget = expressAsyncHandler(async (req, res) => {
        const clientTargetData = new ClientTarget(req.body);
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
        const clientTargets = await this.service.getAllClientTargets(req.params.clientId);

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