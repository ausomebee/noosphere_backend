import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientFolderRepository from "../../infrastucture/clientFolderRepository.js";
import ClientFolderService from "../../application/clientFolderService.js";
import ClientFolder from "../../domain/clientFolder.js";

class ClientFolderController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientFolderRepository = new ClientFolderRepository(
            this.prisma.clientFolder
        );
        this.service = new ClientFolderService({
            clientFolderRepository: this.clientFolderRepository
        });
    }

    createClientFolder = expressAsyncHandler(async (req, res) => {
        const data = new ClientFolder(req.body);
        const newRecord = await this.service.createClientFolder(
            data.createClientFolder
        );

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create client folder" });
        }

        return res.status(201).json({
            message: "Client folder created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateClientFolder = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateClientFolder(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update client folder" });
        }

        return res.status(201).json({
            message: "Client folder updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleClientFolder = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleClientFolder(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch client folder" });
        }

        return res.status(200).json({
            message: "Client folder fetched successfully",
            status: "ok",
            data: record
        });
    });

    getClientFolders = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getClientFolders(req.params.clientTenantId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch client folders" });
        }

        return res.status(200).json({
            message: "Client folders fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default ClientFolderController;
