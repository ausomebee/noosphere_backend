import prismaService from "../../../../config/prisma.js";
import ClientRequestedDocumentsService from "../../application/clientRequestedDocumentsService.js";
import ClientRequestedDocumentsRepository from "../../infrastructure/clientRequestedDocumentsRepository.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import ClientNotificationEmitter from "../../application/clientNotificationEmitter.js";
import SocketService from "../../../../config/socket.js";
import MailService from "../../../../utilities/nodemailer.js";
import emailService from "../../../../utilities/ses.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";

class ClientRequestedDocumentsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientRequestedDocumentsRepository = new ClientRequestedDocumentsRepository(
            this.prisma.clientRequestedDocuments
        );
        this.clientRequestedDocumentsService = new ClientRequestedDocumentsService({
            clientRequestedDocumentsRepository: this.clientRequestedDocumentsRepository,
        });
        this.notificationService = new NotificationService({ notificationRepository: new NotificationsRepository(this.prisma.notification) });
        this.clientNotificationEmitter = new ClientNotificationEmitter({
            prisma: this.prisma,
            notificationService: this.notificationService,
        });
    }

    async createRequestedDocument(req, res) {
        try {
            const data = req.body;
            const request = await this.clientRequestedDocumentsService.createRequestedDocument(data);
            const clientTenant = await this.prisma.clientTenant.findUnique({
                where: { id: request.tenantClientId },
                include: { client: { select: { id: true, email: true, firstName: true } } },
            });
            if (clientTenant) {
                await this.clientNotificationEmitter.emit({
                    clientId: clientTenant.client.id,
                    tenantId: clientTenant.tenantId,
                    type: NotificationType.DOCUMENT_REQUESTED,
                    title: "Document Requested",
                    content: "Your provider has requested documents from you. Please respond.",
                    entityType: NotificationEntityType.DOCUMENT_REQUEST,
                    entityId: request.id,
                    metadata: { dueDate: request.dueDate },
                });

                await this.notificationService.dispatch({
                    recipients: [{ userId: clientTenant.client.id, userType: "CLIENT" }],
                    type: NotificationType.DOCUMENT_REQUEST_CREATED,
                    title: "Document Request",
                    content: "Your provider has requested documents from you. Please respond.",
                    entityType: NotificationEntityType.DOCUMENT_REQUEST,
                    entityId: request.id,
                    metadata: { tenantId: clientTenant.tenantId, tenantClientId: clientTenant.id, dueDate: request.dueDate },
                }, SocketService.emitToUser.bind(SocketService));
                await MailService.sendMail(clientTenant.client.email, "Document Request", "Your provider has requested documents from you. Please respond.");
            }

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

    async nudgeClient(req, res) {
        try {
            const { id } = req.params;

            const request = await this.prisma.clientRequestedDocuments.findUnique({
                where: { id },
                include: {
                    tenantClient: {
                        include: {
                            client: { select: { id: true, email: true, firstName: true } },
                            tenant: { select: { id: true, subdomain: true, companyName: true, email: true } },
                        },
                    },
                },
            });

            if (!request) {
                return res.status(404).json({ message: "Requested document not found" });
            }

            const { client, tenant } = request.tenantClient;

            await this.clientNotificationEmitter.emit({
                clientId: client.id,
                tenantId: tenant.id,
                type: NotificationType.DOCUMENT_REQUEST_NUDGE,
                title: "Document Request Reminder",
                content: `Reminder: please submit "${request.name}" as requested by your provider.`,
                entityType: NotificationEntityType.DOCUMENT_REQUEST,
                entityId: request.id,
                metadata: { dueDate: request.dueDate },
            });

            const html = templateRenderer.render("document-request-nudge.html", {
                firstName: client.firstName,
                documentName: request.name,
                dueDate: new Date(request.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                companyName: tenant.companyName,
                tenantEmail: tenant.email,
                clientPortalUrl: templateRenderer.buildTenantClientUrl(tenant.subdomain),
            });

            const sendMail = await emailService.sendTenantEmail({
                tenantSlug: tenant.subdomain,
                to: [client.email],
                subject: "Document Request Reminder",
                html,
            });

            if (!sendMail?.messageId) {
                return res.status(500).json({ message: "Failed to send reminder email" });
            }

            return res.status(200).json({
                status: "ok",
                message: "Client nudged successfully",
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to nudge client",
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

    async cancelRequestedDocument(req, res) {
        try {
            const id = req.params.id;
            const cancelled = await this.clientRequestedDocumentsService.cancelRequestedDocument({ id });

            return res.status(200).json({
                message: "Requested document cancelled successfully",
                data: cancelled,
            });
        } catch (error) {
            const statusCode = error.message === "Requested Document not found" ? 404 : 400;
            return res.status(statusCode).json({
                message: error.message || "Failed to cancel requested document",
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
            const request = await this.clientRequestedDocumentsService.countAllRequestedDocumentsByStatus(req.params.tenantClientId);

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
