import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientProgramRepository from "../../infrastructure/clientProgramRepository.js";
import ClientProgramService from "../../application/clientProgramService.js";
import ClientProgram from "../../domain/clientProgram.js";
import TargetRepository from "../../infrastructure/targetRepository.js";
import ClientTargetRepository from "../../infrastructure/clientTargetRepository.js";
import ProgramService from "../../application/programService.js";
import ProgramRepository from "../../infrastructure/programRepository.js";
import Program from "../../domain/program.js";
import TargetService from "../../application/targetService.js";
import Target from "../../domain/target.js";

class ClientProgramController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientProgramRepository = new ClientProgramRepository(this.prisma.clientProgram)
        this.targetRepository = new TargetRepository(this.prisma.target)
        this.clientTargetRepository = new ClientTargetRepository(this.prisma.clientTarget)
        this.programRepository = new ProgramRepository(this.prisma.program)
        this.programService = new ProgramService({ programRepository: this.programRepository });
        this.targetService = new TargetService({ targetRepository: this.targetRepository });
        this.service = new ClientProgramService({ clientProgramRepository: this.clientProgramRepository, targetRepository: this.targetRepository, clientTargetRepository: this.clientTargetRepository });
    }

    createClientProgram = expressAsyncHandler(async (req, res) => {
        const program = await this.programService.getProgram(req.body.programId);

        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        const programData = new Program(program);
        const newProgram = await this.programService.createProgram(programData.createProgram);

        if (!newProgram) {
            res.status(500).json({ message: 'Failed to create program' });
        }

        for (const target of program.target) {
            const targetData = new Target({ ...target, programId: newProgram.id });
            const newTarget = await this.targetService.createTarget(targetData.createTarget);

            if (!newTarget) {
                res.status(500).json({ message: 'Failed to create target' });
            }
        }

        const clientProgramData = new ClientProgram({...req.body, programId: newProgram.id});
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

    getClientProgramAndTraget = expressAsyncHandler(async (req, res) => {
        const clientProgram = await this.service.getClientProgramAndTraget(req.params.clientId);

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