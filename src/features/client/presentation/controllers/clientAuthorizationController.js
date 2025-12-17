import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientAuthorizationService from "../../application/clientAuthorizationService.js";
import ClientAuthorizationRepository from "../../infrastructure/clientAuthorizationRepository.js";
import ClientAuthorizationServiceRepository from "../../infrastructure/clientAuthorizationServiceRepository.js";
import ClientAuthorizationServiceService from "../../application/clientAuthorizationServiceService.js";
import ClientAuthorizationServiceDomain from "../../domain/clientAuthorizationService.js";

class ClientAuthorizationController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientAuthorizationRepository = new ClientAuthorizationRepository(this.prisma.clientAuthorization);
        this.clientAuthorizationServiceRepository = new ClientAuthorizationServiceRepository(this.prisma.clientAuthorizationService);
        this.clientAuthorizationService = new ClientAuthorizationService({
            clientAuthorizationRepository: this.clientAuthorizationRepository
        });
        this.clientAuthorizationServiceService = new ClientAuthorizationServiceService({
            clientAuthorizationServiceRepository: this.clientAuthorizationServiceRepository
        });
    }

    async createClientAuthorization(req, res) {
        try {
            const data = req.body;

            const auth = await this.clientAuthorizationService.createClientAuthorization(data);

            for (const sc of data.service || []) {
                const scPayload = new ClientAuthorizationServiceDomain({ ...sc, ClientAuthorizationId: auth.id });
                const newSc = await this.clientAuthorizationServiceService.createClientAuthorizationService(scPayload.createClientAuthorizationService);

                if (!newSc) {
                    return res.status(500).json({ message: "Failed to create client authorization service" });
                }
            }

            return res.status(201).json({
                message: "Client authorization created successfully",
                data: auth,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to create client authorization",
            });
        }
    }

    async updateClientAuthorization(req, res) {
        try {
            const data = {
                id: req.params.id,
                ...req.body,
            };

            const updated = await this.clientAuthorizationService.updateClientAuthorization(data);

            return res.status(200).json({
                message: "Client authorization updated successfully",
                data: updated,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to update client authorization",
            });
        }
    }

    async getSingleClientAuthorization(req, res) {
        try {
            const id = req.params.id;

            const auth = await this.clientAuthorizationService.getSingleClientAuthorization({ id });

            return res.status(200).json({
                message: "Client authorization fetched successfully",
                data: auth,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Client authorization not found",
            });
        }
    }

    async getClientAuthorizations(req, res) {
        try {
            const tenantClientId = req.params.tenantClientId;

            const auths = await this.clientAuthorizationService.getClientAuthorizations(tenantClientId);

            return res.status(200).json({
                message: "Client authorizations fetched successfully",
                data: auths,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Client authorizations not found",
            });
        }
    }

    async getClientAuthorizationsSummary(req, res) {
        try {
            const tenantId = req.params.tenantId;
            const status = req.params.status;

            const auths = await this.clientAuthorizationService.getClientAuthorizationsSummary(tenantId, status);

            return res.status(200).json({
                message: "Client authorizations fetched successfully",
                data: auths,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Client authorizations not found",
            });
        }
    }

    async countAuthorizationStatsByTenant(req, res) {
        try {
            const tenantId = req.params.tenantId;

            const auths = await this.clientAuthorizationService.countAuthorizationStatsByTenant(tenantId);

            return res.status(200).json({
                message: "Client authorizations fetched successfully",
                data: auths,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Client authorizations not found",
            });
        }
    }

    deactivateAuth = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.updateClientAuthorization({
            authTenantId: req.params.id,
            active: req.params.active === "true"
        });

        if (!auth) {
            return res.status(500).json({ message: "Failed to deactivate auth" });
        }

        return res.status(200).json({
            message: "auth deactivated successfully",
            status: "ok",
            data: auth
        });
    });

    deleteAuth = expressAsyncHandler(async (req, res) => {
        const auth = await this.service.updateClientAuthorization({
            authTenantId: req.params.id,
            delete: req.params.delete === "true"
        });

        if (!auth) {
            return res.status(500).json({ message: "Failed to delete auth" });
        }

        return res.status(200).json({
            message: "auth deleted successfully",
            status: "ok",
            data: auth
        });
    });

}

export default ClientAuthorizationController;
