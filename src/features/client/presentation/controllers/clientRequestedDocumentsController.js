import prismaService from "../../../../config/prisma.js";
import ClientRequestedDocumentsService from "../../application/clientRequestedDocumentsService.js";
import ClientRequestedDocumentsRepository from "../../infrastructure/clientRequestedDocumentsRepository.js";

class ClientRequestedDocumentsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientRequestedDocumentsRepository = new ClientRequestedDocumentsRepository(
            this.prisma.clientRequestedDocuments
        );
        this.clientRequestedDocumentsService = new ClientRequestedDocumentsService({
            clientRequestedDocumentsRepository: this.clientRequestedDocumentsRepository,
        });
    }

    async createRequestedDocument(req, res) {
        try {
            const data = req.body;
            const request = await this.clientRequestedDocumentsService.createRequestedDocument(data);

            return res.status(201).json({
                message: "Requested document created successfully",
                data: request,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to create requested document",
            });
        }
    }

    async updateRequestedDocument(req, res) {
        try {
            const data = {
                id: req.params.id,
                ...req.body,
            };

            const updated = await this.clientRequestedDocumentsService.updateRequestedDocument(data);

            return res.status(200).json({
                message: "Requested document updated successfully",
                data: updated,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to update requested document",
            });
        }
    }

    async getSingleRequestedDocument(req, res) {
        try {
            const id = req.params.id;

            const request =
                await this.clientRequestedDocumentsService.getSingleRequestedDocument({ id });

            if (!request) {
                return res.status(404).json({
                    message: "Requested document not found",
                });
            }

            const now = new Date();
            const dueDate = new Date(request.dueDate);

            const isOverdue =
                request.status === "PENDING" && dueDate < now;

            const updatedRequest = {
                ...request,
                status: isOverdue ? "OVERDUE" : request.status,
            };

            return res.status(200).json({
                message: "Requested document fetched successfully",
                data: updatedRequest,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Requested document not found",
            });
        }
    }

    async countAllRequestedDocumentsByStatus(req, res) {
        try {
            const request = await this.clientRequestedDocumentsService.countAllRequestedDocumentsByStatus();

            return res.status(200).json({
                message: "Requested documents counted successfully",
                data: request,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Requested document not found",
            });
        }
    }

    async getRequestedDocuments(req, res) {
        try {
            const tenantClientId = req.params.tenantClientId;

            const requests =
                await this.clientRequestedDocumentsService.getRequestedDocuments(
                    tenantClientId
                );

            const now = new Date();

            const updatedRequests = requests.map((doc) => {
                const dueDate = new Date(doc.dueDate);

                const isOverdue =
                    doc.status === "PENDING" && dueDate < now;

                return {
                    ...doc,
                    status: isOverdue ? "OVERDUE" : doc.status,
                };
            });

            return res.status(200).json({
                message: "Requested documents fetched successfully",
                data: updatedRequests,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Requested documents not found",
            });
        }
    }

}

export default ClientRequestedDocumentsController;
