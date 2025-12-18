class ClientAuthorizationServiceDomain {
    constructor({
        id,
        serviceCodeId,
        ClientAuthorizationId,
        modifiers,
        units,
        per,
    }) {
        this.id = id;
        this.serviceCodeId = serviceCodeId;
        this.ClientAuthorizationId = ClientAuthorizationId;
        this.modifiers = modifiers;
        this.units = units;
        this.per = per;
    }

    get createClientAuthorizationService() {
        return {
            serviceCodeId: this.serviceCodeId,
            ClientAuthorizationId: this.ClientAuthorizationId,
            modifiers: this.modifiers,
            units: this.units,
            per: this.per,
        };
    }
}

export default ClientAuthorizationServiceDomain;
