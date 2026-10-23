import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ProgramService from "../../application/programService.js";
import ProgramRepository from "../../infrastructure/programRepository.js";
import Program from "../../domain/program.js";
import ClientProgramRepository from "../../infrastructure/clientProgramRepository.js";
import ClientProgramService from "../../application/clientProgramService.js";
import ClientProgram from "../../domain/clientProgram.js";
import TargetRepository from "../../infrastructure/targetRepository.js";
import ClientTargetRepository from "../../infrastructure/clientTargetRepository.js";

class ProgramController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.programRepository = new ProgramRepository(this.prisma.program)
        this.service = new ProgramService({ programRepository: this.programRepository });
        this.clientProgramRepository = new ClientProgramRepository(this.prisma.clientProgram)
        this.targetRepository = new TargetRepository(this.prisma.target)
        this.clientTargetRepository = new ClientTargetRepository(this.prisma.clientTarget)
        this.clientProgramService = new ClientProgramService({ clientProgramRepository: this.clientProgramRepository, targetRepository: this.targetRepository, clientTargetRepository: this.clientTargetRepository });
    }

    createProgram = expressAsyncHandler(async (req, res) => {
        const programData = new Program(req.body);
        const program = await this.service.createProgram(programData.createProgram);

        if (!program) {
            res.status(500).json({ message: 'Failed to create program' });
        }

        await auditLogger.log(req, {
            tenantId: program.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Program Management",
            action: `created program ${program.id}`,
            reason: "Program management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "program created successfully",
            status: 'ok',
            data: program
        });
    });

    createCustomProgram = expressAsyncHandler(async (req, res) => {
        const programData = new Program(req.body);
        const program = await this.service.createProgram(programData.createProgram);

        if (!program) {
            res.status(500).json({ message: 'Failed to create program' });
        }

        const clientProgramData = new ClientProgram({...req.body, programId: program.id});
        const clientProgram = await this.clientProgramService.createClientProgram(clientProgramData.createClientProgram);

        if (!clientProgram) {
            res.status(500).json({ message: 'Failed to create client program' });
        }

        await auditLogger.log(req, {
            tenantId: program.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Program Management",
            action: `created custom program ${program.id}`,
            reason: "Program management",
            accessedBy: req.user?.name || null,
        });

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

        await auditLogger.log(req, {
            tenantId: program.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Program Management",
            action: `updated program ${program.id}`,
            reason: "Program management",
            accessedBy: req.user?.name || null,
        });

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

    getAllTenantPrograms = expressAsyncHandler(async (req, res) => {
        const programs = await this.service.getAllTenantPrograms(req.params.tenantId);

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

        await auditLogger.log(req, {
            tenantId: program.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Program Management",
            action: `deleted program ${program.id}`,
            reason: "Program management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "program deleted successfully",
            status: 'ok',
            data: program
        });
    });

}

export default ProgramController;