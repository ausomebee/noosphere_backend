class ClientAuthorizationServiceDomain {
    constructor({
        id,
        serviceCodeId,
        clientAuthorizationId,
        modifiers,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.serviceCodeId = serviceCodeId;
        this.clientAuthorizationId = clientAuthorizationId;
        this.modifiers = modifiers;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createClientAuthorizationService() {
        return {
            serviceCodeId: this.serviceCodeId,
            clientAuthorizationId: this.clientAuthorizationId,
            modifiers: this.modifiers,
        };
    }
}

export default ClientAuthorizationServiceDomain;
