class Client {
    constructor({ id, fullName, email, phoneNumber, stage, password, tenantId, DOB, gender, clientId, dbAccess }) {
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
    }

    get createClient() {
        return {
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: this.password,
            DOB: this.DOB,
            gender: this.gender,
        };
    }

    get createClientTenant() {
        return {
            clientId: this.clientId,
            tenantId: this.tenantId,
            dbAccess: this.dbAccess,
            stage: this.stage,
        };
    }

}

export default Client;