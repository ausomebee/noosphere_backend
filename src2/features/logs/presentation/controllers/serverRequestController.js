import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ServerRequestRepository from "../../infrastructure/serverRequestRepository.js";
import ServerRequestService from "../../application/serverRequestService.js";

class ServerRequestController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.serverRequestRepository = new ServerRequestRepository(this.prisma.serverRequest);
        this.service = new ServerRequestService({ serverRequestRepository: this.serverRequestRepository });
    }

    createRequest = expressAsyncHandler(async (req, res) => {
        const requestLog = await this.service.createRequest(req.body);

        if (!requestLog) {
            return res.status(500).json({ message: 'Failed to create server request log' });
        }

        return res.status(201).json({
            message: "Server request log created successfully",
            status: 'ok',
            data: requestLog
        });
    });

    getSingleRequest = expressAsyncHandler(async (req, res) => {
        const requestLog = await this.service.getSingleRequest(req.params);

        if (!requestLog) {
            return res.status(404).json({ message: 'Server request log not found' });
        }

        return res.status(200).json({
            message: "Server request log fetched successfully",
            status: 'ok',
            data: requestLog
        });
    });

    getTenantRequests = expressAsyncHandler(async (req, res) => {
        const logs = await this.service.getTenantRequests(req.query);

        if (!logs || logs.data.length === 0) {
            return res.status(404).json({ message: 'No server request logs found for this tenant' });
        }

        return res.status(200).json({
            message: "Server request logs fetched successfully",
            status: 'ok',
            data: logs
        });
    });

    getRequestsByDateRange = expressAsyncHandler(async (req, res) => {
        const logs = await this.service.getRequestsByDateRange(req.query);

        if (!logs || logs.data.length === 0) {
            return res.status(404).json({ message: 'No server request logs found in the given date range' });
        }

        return res.status(200).json({
            message: "Server request logs fetched successfully",
            status: 'ok',
            data: logs
        });
    });
}

export default ServerRequestController;