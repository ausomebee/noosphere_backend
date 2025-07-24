class Client {
    constructor({ id, fullName, createdBy, email, phoneNumber, stage, password, tenantId, DOB, gender, clientId, dbAccess, streetAddress, city, state, country, zipCode, pipelineStageId, ass }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.stage = stage;
        this.password = password;
        this.tenantId = tenantId;
        this.DOB = DOB;
        this.gender = gender;
        this.clientId = clientId;
        this.dbAccess = dbAccess;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
        this.pipelineStageId = pipelineStageId;
        this.createdBy = createdBy;
    }

    get createClient() {
        return {
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: this.password,
            DOB: this.DOB,
            gender: this.gender,
            streetAddress: this.streetAddress,
            city: this.city,
            state: this.state,
            country: this.country,
            zipCode: this.zipCode
        };
    }

    get createClientTenant() {
        return {
            clientId: this.clientId,
            tenantId: this.tenantId,
            dbAccess: this.dbAccess,
            stage: this.stage,
            createdBy: this.createdBy,
        };
    }

}

export default Client;