import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientProgramRepository from "../../infrastructure/clientProgramRepository.js";
import ClientProgramService from "../../application/clientProgramService.js";
import ClientProgram from "../../domain/clientProgram.js";
import TargetRepository from "../../infrastructure/targetRepository.js";
import ClientTargetRepository from "../../infrastructure/clientTargetRepository.js";

class ClientProgramController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientProgramRepository = new ClientProgramRepository(this.prisma.clientProgram)
        this.targetRepository = new TargetRepository(this.prisma.target)
        this.clientTargetRepository = new ClientTargetRepository(this.prisma.clientTarget)
        this.service = new ClientProgramService({ clientProgramRepository: this.clientProgramRepository, targetRepository: this.targetRepository, clientTargetRepository: this.clientTargetRepository });
    }

    createClientProgram = expressAsyncHandler(async (req, res) => {
        const clientProgramData = new ClientProgram(req.body);
        const clientProgram = await this.service.createClientProgram(clientProgramData.createClientProgram);

        if (!clientProgram) {
            res.status(500).json({ message: 'Failed to create client program' });
        }

        return res.status(201).json({
            message: "client program created successfully",
            status: 'ok',
            data: clientProgram
        });
    });

    getClientPrograms = expressAsyncHandler(async (req, res) => {
        const clientProgram = await this.service.getAllClientProgram(req.params.clientId);

        if (!clientProgram) {
            res.status(500).json({ message: 'Failed to fetch client program' });
        }

        return res.status(201).json({
            message: "client programs fetched successfully",
            status: 'ok',
            data: clientProgram
        });
    });
}

export default ClientProgramController;