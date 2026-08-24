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
import TenantRepository from "../../../tenant/infrastructure/tenantRepository.js";
import TenantService from "../../../tenant/application/tenantService.js";
import RefreshTokenRepository from "../../../auth/infrastructure/refreshTokenRepository.js";
import RefreshTokenService from "../../../auth/application/refreshTokenService.js";
import auditLogger from "../../../logs/application/auditLogger.js";

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
        this.tenantRepository = new TenantRepository(this.prisma.tenant)
        this.tenantService = new TenantService({ tenantRepository: this.tenantRepository });
        this.refreshTokenRepository = new RefreshTokenRepository(this.prisma.refreshTokens);
        this.refreshTokenService = new RefreshTokenService({ refreshTokenRepository: this.refreshTokenRepository });
    }

    createClientCandidate = expressAsyncHandler(async (req, res) => {
        const tenant = await this.tenantService.getTenant(req.body.tenantId);

        if (!tenant) {
            return res.status(500).json({ message: 'Failed to fetch tenant' });
        }

        const candidate = await this.service.createClientCandidate(req.body, tenant);

        if (!candidate) {
            res.status(500).json({ message: 'Failed to create client candidate' });
        }

        for (const field of req.body.documents || []) {
            const documentsData = new ClientDocuments({ ...field, tenantClientId: candidate.tenantClientId });
            const doc = await this.clientDocumentsService.createClientDocument(documentsData.createClientDocument);
            if (!doc) {
                return res.status(500).json({ message: 'Failed to update client' });
            }
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
            return res.status(500).json({ message: 'Failed to update client' });
        }

        for (const field of req.body.documents || []) {
            const documentsData = new ClientDocuments({ ...field, tenantClientId: client.clientTenantId });
            const doc = await this.clientDocumentsService.createClientDocument(documentsData.createClientDocument);
            if (!doc) {
                return res.status(500).json({ message: 'Failed to update client' });
            }
        }

        return res.status(201).json({
            message: "candidate updated successfully",
            status: 'ok',
            data: client
        });
    });

    updateClientPassword = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateClientPassword(req.body);

        if (!client) {
            return res.status(500).json({ message: 'Failed to update client password' });
        }

        return res.status(201).json({
            message: "candidate password updated successfully",
            status: 'ok',
            data: client
        });
    });

    updateClientAvatar = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateClient({
            id: req.body.clientId,
            avatarUrl: req.body.avatarUrl
        });

        if (!client) {
            return res.status(500).json({ message: 'Failed to update client avatar' });
        }

        return res.status(201).json({
            message: "candidate avatar updated successfully",
            status: 'ok',
            data: client
        });
    });

    getTenantClients = expressAsyncHandler(async (req, res) => {
        const clients = await this.service.getTenantClients(req.params.tenantId, req.user);

        if (!clients) {
            return res.status(500).json({ message: 'Failed to fetch clients' });
        }

        return res.status(201).json({
            message: "clients fetched successfully",
            status: 'ok',
            data: clients
        });
    });

    getTenantClientsByAvailableStaff = expressAsyncHandler(async (req, res) => {
        const clients = await this.service.getTenantClientsByAvailableStaff(
            req.params.tenantId,
            req.query.date,
            req.query.time,
            req.user
        );

        return res.status(200).json({
            message: "clients with available staff fetched successfully",
            status: "ok",
            data: clients
        });
    });

    getClientsByClinician = expressAsyncHandler(async (req, res) => {
        const clients = await this.service.getClientsByClinician(req.params.staffId, req.params.tenantId);

        if (!clients) {
            return res.status(500).json({ message: 'Failed to fetch clients' });
        }

        return res.status(201).json({
            message: "clients fetched successfully",
            status: 'ok',
            data: clients
        });
    });

    login = expressAsyncHandler(async (req, res) => {
        const client = await this.service.login({...req.body, subdomain: req.headers.host.split('.')[0]});

        if (!client) {
            return res.status(500).json({ message: 'Failed to login' });
        }

        const refreshToken = await this.refreshTokenService.createRefreshToken({
            ownerId: client.id,
            ownerType: "CLIENT",
            refreshToken: client.refreshToken,
            fingerprint: req.headers["x-fingerprint"],
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        });

        if (!refreshToken) {
            return res.status(500).json({ message: 'Failed to create refresh token' });
        }

        await auditLogger.log(req, {
            tenantId: client.tenantId,
            clientId: client.id,
            module: "CLIENT",
            feature: "login",
            action: `${client.firstName || client.fullName || "Client"} logged in`,
            reason: "User login",
            details: `Client logged in at ${new Date().toISOString()}`,
            outcome: "SUCCESS",
            accessedBy: client.firstName || client.fullName || null,
        });

        return res.status(201).json({
            message: "login successful",
            status: 'ok',
            data: client
        });
    });

    resetPassword = expressAsyncHandler(async (req, res) => {
        const client = await this.service.updateTenantClient({...req.body, passwordChanged: true});

        if (!client) {
            return res.status(500).json({ message: 'Failed to reset password' });
        }

        return res.status(201).json({
            message: "password reset successful",
            status: 'ok',
            data: client
        });
    });

    getSingleClient = expressAsyncHandler(async (req, res) => {
        const client = await this.service.getSingleClient(req.params.clientId, req.user);

        if (!client) {
            return res.status(500).json({ message: 'Failed to fetch client' });
        }

        return res.status(201).json({
            message: "client fetched successfully",
            status: 'ok',
            data: client
        });
    });

    initiatePasswordReset = expressAsyncHandler(async (req, res) => {
        const client = await this.service.initiatePasswordReset(req.params.email);

        if (!client) {
            return res.status(500).json({ message: 'Failed to send email' });
        }

        return res.status(201).json({
            message: "email sent successfully",
            status: 'ok',
            data: client
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
