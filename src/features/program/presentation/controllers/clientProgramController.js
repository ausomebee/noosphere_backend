import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientProgramRepository from "../../infrastructure/clientProgramRepository.js";
import ClientProgramService from "../../application/clientProgramService.js";
import ClientProgram from "../../domain/clientProgram.js";

class ClientProgramController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientProgramRepository = new ClientProgramRepository(this.prisma.clientProgram)
        this.service = new ClientProgramService({ clientProgramRepository: this.clientProgramRepository });
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

}

export default ClientProgramController;