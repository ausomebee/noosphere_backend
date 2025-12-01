class ClientAuthorizationService {
    constructor({ clientAuthorizationRepository }) {
        this.clientAuthorizationRepository = clientAuthorizationRepository;
    }

    async createClientAuthorization(data) {
        const existing = await this.clientAuthorizationRepository.findFirstDynamic({
            where: {
                authorizationNumber: data.authorizationNumber,
                tenantClientId: data.tenantClientId
            },
            select: { id: true }
        });

        if (existing) {
            throw new Error("An authorization with this number already exists for this client.");
        }

        const newAuth = await this.clientAuthorizationRepository.create(data);

        if (!newAuth) {
            throw new Error("Failed to create Client Authorization");
        }

        return newAuth;
    }

    async updateClientAuthorization(data) {
        const auth = await this.clientAuthorizationRepository.findOne({ id: data.id });

        if (!auth) {
            throw new Error("Client Authorization not found");
        }

        const update = await this.clientAuthorizationRepository.update(data.id, {
            title: data.title ?? auth.title,
            authorizationNumber: data.authorizationNumber ?? auth.authorizationNumber,
            startDate: data.startDate ?? auth.startDate,
            endDate: data.endDate ?? auth.endDate,
            payer: data.payer ?? auth.payer,
            insuranceType: data.insuranceType ?? auth.insuranceType,
            serviceCodes: data.serviceCodes ?? auth.serviceCodes,
            isDeleted: data.isDeleted ?? auth.isDeleted,
            isActive: data.isActive ?? auth.isActive,
        });

        if (!update) {
            throw new Error("Failed to update Client Authorization");
        }

        return update;
    }

    async getSingleClientAuthorization(data) {
        const auth = await this.clientAuthorizationRepository.findOne({ id: data.id });

        if (!auth) {
            throw new Error("Client Authorization not found");
        }

        return auth;
    }

    async getClientAuthorizations(tenantClientId) {
        const auths = await this.clientAuthorizationRepository.findAllAndPopulate({ tenantClientId }, { payerDetails: true, insurance: true });

        if (!auths) {
            throw new Error("Client Authorizations not found");
        }

        return auths;
    }

}

export default ClientAuthorizationService;
