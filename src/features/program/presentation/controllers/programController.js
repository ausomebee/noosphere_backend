import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ProgramService from "../../application/programService.js";
import ProgramRepository from "../../infrastructure/programRepository.js";
import Program from "../../domain/program.js";

class ProgramController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.programRepository = new ProgramRepository(this.prisma.program)
        this.service = new ProgramService({ programRepository: this.programRepository });
    }

    createProgram = expressAsyncHandler(async (req, res) => {
        const programData = new Program(req.body);
        const program = await this.service.createProgram(programData.createProgram);

        if (!program) {
            res.status(500).json({ message: 'Failed to create program' });
        }

        return res.status(201).json({
            message: "program created successfully",
            status: 'ok',
            data: program
        });
    });

    updateProgram = expressAsyncHandler(async (req, res) => {
        const program = await this.service.updateProgram(req.body);

        if (!program) {
            res.status(500).json({ message: 'Failed to update program' });
        }

        return res.status(201).json({
            message: "program updated successfully",
            status: 'ok',
            data: program
        });
    });

    getAllDomainPrograms = expressAsyncHandler(async (req, res) => {
        const programs = await this.service.getAllDomainPrograms(req.params.domainId);

        if (!programs) {
            res.status(500).json({ message: 'Failed to fetch programs' });
        }

        return res.status(201).json({
            message: "programs fetched successfully",
            status: 'ok',
            data: programs
        });
    });

    deleteProgram = expressAsyncHandler(async (req, res) => {
        const program = await this.service.updateProgram({ id: req.params.id, isDeleted: true });

        if (!program) {
            res.status(500).json({ message: 'Failed to delete program' });
        }

        return res.status(201).json({
            message: "program deleted successfully",
            status: 'ok',
            data: program
        });
    });

}

export default ProgramController;