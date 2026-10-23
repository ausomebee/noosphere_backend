class SessionTypeServiceDomain {
    constructor({
        id,
        serviceCodeId,
        sessionTypeId,
        modifiers,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.serviceCodeId = serviceCodeId;
        this.sessionTypeId = sessionTypeId;
        this.modifiers = modifiers;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createSessionTypeService() {
        return {
            serviceCodeId: this.serviceCodeId,
            sessionTypeId: this.sessionTypeId,
            modifiers: this.modifiers,
        };
    }
}

export default SessionTypeServiceDomain;
