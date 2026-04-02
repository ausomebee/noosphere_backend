import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientFilesRepository from "../../infrastucture/clientFilesRepository.js";
import ClientFilesService from "../../application/clientFilesService.js";
import ClientFiles from "../../domain/clientFiles.js";

class ClientFilesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientFilesRepository = new ClientFilesRepository(
            this.prisma.clientFiles
        );
        this.service = new ClientFilesService({
            clientFilesRepository: this.clientFilesRepository
        });
    }

    createClientFile = expressAsyncHandler(async (req, res) => {
        const data = new ClientFiles(req.body);
        const newRecord = await this.service.createClientFile(
            data.createClientFile
        );

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create client file" });
        }

        return res.status(201).json({
            message: "Client file created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateClientFile = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateClientFile(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update client file" });
        }

        return res.status(201).json({
            message: "Client file updated successfully",
            status: "ok",
            data: updated
        });
    });

    findRecentFilesByClientTenant = expressAsyncHandler(async (req, res) => {
        const record = await this.service.findRecentFilesByClientTenant(req.params.clientTenantId);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch client file" });
        }

        return res.status(200).json({
            message: "Client file fetched successfully",
            status: "ok",
            data: record
        });
    });

    findFilesByClientTenant = expressAsyncHandler(async (req, res) => {
        const record = await this.service.findFilesByClientTenant(req.params.clientTenantId);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch client file" });
        }

        return res.status(200).json({
            message: "Client file fetched successfully",
            status: "ok",
            data: record
        });
    });

    getSingleClientFile = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleClientFile(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch client file" });
        }

        return res.status(200).json({
            message: "Client file fetched successfully",
            status: "ok",
            data: record
        });
    });

    getClientFiles = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getClientFiles(req.params.folderId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch client files" });
        }

        return res.status(200).json({
            message: "Client files fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default ClientFilesController;
