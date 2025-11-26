import prismaService from "../../../../config/prisma.js";
import ClientAuthorizationService from "../../application/clientAuthorizationService.js";
import ClientAuthorizationRepository from "../../infrastructure/clientAuthorizationRepository.js";

class ClientAuthorizationController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientAuthorizationRepository = new ClientAuthorizationRepository(this.prisma.clientAuthorization);
        this.clientAuthorizationService = new ClientAuthorizationService({
            clientAuthorizationRepository: this.clientAuthorizationRepository
        });
    }

    async createClientAuthorization(req, res) {
        try {
            const data = req.body;

            const auth = await this.clientAuthorizationService.createClientAuthorization(data);

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
}

export default ClientAuthorizationController;
