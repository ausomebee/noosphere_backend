import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientRepository from "../../infrastructure/clientRepository.js";
import ClientService from "../../application/clientService.js";
import ReferralCodeGenerator from "../../../../utilities/generateCode.js";
import ClientTenantRepository from "../../infrastructure/clientTenantRepository.js";
import ItemRepository from "../../../pipeline/infrastructure/itemRepository.js";
import ClientDocuments from "../../domain/clientDocument.js";
import ClientDocumentsRepository from "../../infrastructure/clientDocumentsRepository.js";
import ClientDocumentsService from "../../application/clientDocumentsService.js";

class ClientController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.clientRepository = new ClientRepository(this.prisma.client);
        this.clientTenantRepository = new ClientTenantRepository(this.prisma.clientTenant);
        this.itemRepository = new ItemRepository(this.prisma.pipelineItem);
        this.generateCode = new ReferralCodeGenerator(12);
        this.service = new ClientService({ clientRepository: this.clientRepository, clientTenantRepository: this.clientTenantRepository, generateCode: this.generateCode, prisma: this.prisma, itemRepository: this.itemRepository });
        this.clientDocumentsRepository = new ClientDocumentsRepository(this.prisma.clientDocuments);
        this.clientDocumentsService = new ClientDocumentsService({ clientDocumentsRepository: this.clientDocumentsRepository });
    }

    createClientCandidate = expressAsyncHandler(async (req, res) => {
        const candidate = await this.service.createClientCandidate(req.body);

        if (!candidate) {
            res.status(500).json({ message: 'Failed to create client candidate' });
        }

        for (const field of req.body.documents || []) {
            const documentsData = new ClientDocuments({ ...field, tenantClientId: candidate.tenantClientId });
            const doc = await this.clientDocumentsService.createClientDocument(documentsData.createClientDocument);
        }

        return res.status(201).json({
            message: "candidate created successfully",
            status: 'ok',
            data: candidate
        });
    });

    updateClient = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateClient(req.body);

        if (!client) {
            res.status(500).json({ message: 'Failed to update client' });
        }

        return res.status(201).json({
            message: "candidate updated successfully",
            status: 'ok',
            data: client
        });
    });

    getTenantClients = expressAsyncHandler(async (req, res) => {
        const clients = await this.service.getTenantClients(req.params.tenantId);

        if (!clients) {
            res.status(500).json({ message: 'Failed to fetch clients' });
        }

        return res.status(201).json({
            message: "clients fetched successfully",
            status: 'ok',
            data: clients
        });
    });

    deactivateClient = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateTenantClient({
            clientTenantId: req.params.clientTenantId,
            active: req.params.active === "true"
        });

        if (!client) {
            return res.status(500).json({ message: "Failed to deactivate client" });
        }

        return res.status(200).json({
            message: "Client deactivated successfully",
            status: "ok",
            data: client
        });
    });

    clientPortalSettings = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateTenantClient(req.body);

        if (!client) {
            return res.status(500).json({ message: "Failed to set client portal access" });
        }

        return res.status(200).json({
            message: "Client portal access set successfully",
            status: "ok",
            data: client
        });
    });

    manageDocumentRequest = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateTenantClient(req.body);

        if (!client) {
            return res.status(500).json({ message: "Failed to deactivate client" });
        }

        return res.status(200).json({
            message: "Client deactivated successfully",
            status: "ok",
            data: client
        });
    });
}

export default ClientController;