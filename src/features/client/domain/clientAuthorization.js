class ClientAuthorization {
    constructor({
        id,
        tenantClientId,
        title,
        authorizationNumber,
        startDate,
        endDate,
        payer,
        insuranceType,
    }) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.title = title;
        this.authorizationNumber = authorizationNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.payer = payer;
        this.insuranceType = insuranceType;
    }

    get createAuthorization() {
        return {
            tenantClientId: this.tenantClientId,
            title: this.title,
            authorizationNumber: this.authorizationNumber,
            startDate: this.startDate,
            endDate: this.endDate,
            payer: this.payer,
            insuranceType: this.insuranceType,
        };
    }
}

export default ClientAuthorization;
