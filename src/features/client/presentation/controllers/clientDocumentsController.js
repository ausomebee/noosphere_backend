import prismaService from "../../../../config/prisma.js";
import ClientDocumentsService from "../../application/clientDocumentsService.js";
import ClientDocumentsRepository from "../../infrastructure/clientDocumentsRepository.js";

class ClientDocumentsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientDocumentsRepository = new ClientDocumentsRepository(this.prisma.clientDocuments);
        this.clientDocumentsService = new ClientDocumentsService({ clientDocumentsRepository: this.clientDocumentsRepository });
    }

    async createClientDocument(req, res) {
        try {
            const data = req.body;
            const doc = await this.clientDocumentsService.createClientDocument(data);

            return res.status(201).json({
                message: "Client document created successfully",
                data: doc,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to create client document",
            });
        }
    }

    async updateClientDocument(req, res) {
        try {
            const data = {
                id: req.params.id,
                ...req.body,
            };

            const updated = await this.clientDocumentsService.updateClientDocument(data);

            return res.status(200).json({
                message: "Client document updated successfully",
                data: updated,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to update client document",
            });
        }
    }

    async getSingleClientDocument(req, res) {
        try {
            const id = req.params.id;

            const doc = await this.clientDocumentsService.getSingleClientDocument({ id });

            return res.status(200).json({
                message: "Client document fetched successfully",
                data: doc,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Client document not found",
            });
        }
    }

    async getClientDocuments(req, res) {
        try {
            const tenantClientId = req.params.tenantClientId;

            const docs = await this.clientDocumentsService.getClientDocuments(tenantClientId);

            return res.status(200).json({
                message: "Client documents fetched successfully",
                data: docs,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Client documents not found",
            });
        }
    }
}

export default ClientDocumentsController;
