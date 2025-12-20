class ClientAuthorizationServiceService {
    constructor({ clientAuthorizationServiceRepository }) {
        this.clientAuthorizationServiceRepository =
            clientAuthorizationServiceRepository;
    }

    async createClientAuthorizationService(data) {
        const exists = await this.clientAuthorizationServiceRepository.findFirstDynamic({
            where: {
                serviceCodeId: data.serviceCodeId,
                clientAuthorizationId: data.clientAuthorizationId,
            },
            select: { id: true },
        });

        if (exists) {
            throw new Error(
                "Service code already exists for this client authorization."
            );
        }

        const newRecord = await this.clientAuthorizationServiceRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create client authorization service");
        }

        return newRecord;
    }

    async updateClientAuthorizationService(data) {
        const record = await this.clientAuthorizationServiceRepository.findOne({
            id: data.id,
        });

        if (!record) {
            throw new Error("Client authorization service not found");
        }

        const update = await this.clientAuthorizationServiceRepository.update(data.id, {
            modifiers: data.modifiers || record.modifiers,
            serviceCodeId:
                data.serviceCodeId || record.serviceCodeId,
            clientAuthorizationId:
                data.clientAuthorizationId ||
                record.clientAuthorizationId,
        });

        if (!update) {
            throw new Error(
                "Failed to update client authorization service"
            );
        }

        return update;
    }

    async getSingleClientAuthorizationService(id) {
        const record = await this.clientAuthorizationServiceRepository.findOne({ id });

        if (!record) {
            throw new Error("Client authorization service not found");
        }

        return record;
    }

    async getClientAuthorizationServices(clientAuthorizationId) {
        const records = await this.clientAuthorizationServiceRepository.findAllAndPopulate(
            { clientAuthorizationId },
            { serviceCode: true }
        );

        if (!records) {
            throw new Error("Client authorization services not found");
        }

        return records;
    }

    async updateUnitUsed(data) {
        const update = await this.clientAuthorizationServiceRepository.update(data.id, {
            usedUnit: { increment: data.unitsUsed }
        });

        if (!update) {
            throw new Error(
                "Failed to update client authorization service"
            );
        }

        return update;
    }

    async getClientAuthorizationServices(tenantClientId) {
        const record = await this.clientAuthorizationServiceRepository.getClientServices(tenantClientId);

        if (!record) {
            throw new Error("Client authorization service not found");
        }

        return record;
    }
}

export default ClientAuthorizationServiceService;
