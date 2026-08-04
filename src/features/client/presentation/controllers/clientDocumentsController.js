import prismaService from "../../../../config/prisma.js";
import ClientDocumentsService from "../../application/clientDocumentsService.js";
import ClientDocumentsRepository from "../../infrastructure/clientDocumentsRepository.js";
import expressAsyncHandler from "express-async-handler";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import SocketService from "../../../../config/socket.js";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";

class ClientDocumentsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientDocumentsRepository = new ClientDocumentsRepository(this.prisma.clientDocuments);
        this.clientDocumentsService = new ClientDocumentsService({ clientDocumentsRepository: this.clientDocumentsRepository });
        this.notificationService = new NotificationService({ notificationRepository: new NotificationsRepository(this.prisma.notification) });
    }

    async createClientDocument(req, res) {
        try {
            const data = req.body;
            const doc = await this.clientDocumentsService.createClientDocument(data);
            if (doc.requestId) {
                const request = await this.prisma.clientRequestedDocuments.findUnique({
                    where: { id: doc.requestId },
                    include: { tenantClient: { include: { clinicians: { select: { id: true } } } } },
                });
                if (request?.tenantClient?.clinicians?.length) {
                    await this.notificationService.dispatch({
                        recipients: request.tenantClient.clinicians.map((clinician) => ({ userId: clinician.id, userType: "TENANT_STAFF" })),
                        type: NotificationType.DOCUMENT_REQUEST_COMPLETED,
                        title: "Document Request Completed",
                        content: "A client has completed a document request.",
                        entityType: NotificationEntityType.DOCUMENT_REQUEST,
                        entityId: request.id,
                        metadata: { tenantId: request.tenantClient.tenantId, tenantClientId: request.tenantClientId, documentId: doc.id },
                    }, SocketService.emitToUser.bind(SocketService));
                }
            }

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
            const updated = await this.clientDocumentsService.updateClientDocument(req.body);

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

    async getRequestDocuments(req, res) {
        try {
            const requestId = req.params.requestId;

            const docs = await this.clientDocumentsService.getClientDocuments(requestId);

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

    deleteClientDocument = expressAsyncHandler(async (req, res) => {
        const client = await this.clientDocumentsService.updateClientDocument({
            id: req.params.id,
            isDeleted: true
        });

        if (!client) {
            return res.status(500).json({ message: "Failed to delete client doc" });
        }

        return res.status(200).json({
            message: "Client doc deleted successfully",
            status: "ok",
            data: client
        });
    });
}

export default ClientDocumentsController;
