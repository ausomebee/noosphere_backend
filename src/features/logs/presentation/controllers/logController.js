import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import LogsRepository from "../../infrastructure/logsRepository.js";
import LogsService from "../../application/logsService.js";

class LogsController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.service = new LogsService({ logsRepository: this.logsRepository });
    }

    createLog = expressAsyncHandler(async (req, res) => {
        const log = await this.service.createLog(req.body);

        if (!log) {
            res.status(500).json({ message: 'Failed to create log' });
        }

        return res.status(201).json({
            message: "Log created successfully",
            status: 'ok',
            data: log
        });
    });

    getSingleLog = expressAsyncHandler(async (req, res) => {
        const log = await this.service.getSingleLog(req.params);

        if (!log) {
            res.status(500).json({ message: 'Failed to fetch log' });
        }

        return res.status(201).json({
            message: "Log fetched successfully",
            status: 'ok',
            data: log
        });
    });

}

export default LogsController;