class ClientAuthorizationServiceDomain {
    constructor({
        id,
        serviceCodeId,
        clientAuthorizationId,
        modifiers,
        units,
        per,
    }) {
        this.id = id;
        this.serviceCodeId = serviceCodeId;
        this.clientAuthorizationId = clientAuthorizationId;
        this.modifiers = modifiers;
        this.units = units;
        this.per = per;
    }

    get createClientAuthorizationService() {
        return {
            serviceCodeId: this.serviceCodeId,
            clientAuthorizationId: this.clientAuthorizationId,
            modifiers: this.modifiers,
            units: this.units,
            per: this.per,
        };
    }
}

export default ClientAuthorizationServiceDomain;
