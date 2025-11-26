class Client {
    constructor({
        id,
        firstName,
        lastName,
        preferredName,
        email,
        phoneNumber,
        DOB,
        gender,
        primaryPayer,
        streetAddress,
        city,
        state,
        country,
        zipCode,
        tenantId,
        assignToClinicians,
        caregiverName,
        caregiverRelationship,
        caregiverPhone,
        caregiverEmail,
        caregiverStreetAddress,
        caregiverCity,
        caregiverState,
        caregiverCountry,
        caregiverZip,
        createdBy,
        documents,
        clientPortalAccess,
        stage,
        isVerified,
        isDeleted,
        createdAt,
        updatedAt,
        password
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.preferredName = preferredName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.DOB = DOB;
        this.gender = gender;
        this.primaryPayer = primaryPayer;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;

        this.caregiverName = caregiverName;
        this.caregiverRelationship = caregiverRelationship;
        this.caregiverPhone = caregiverPhone;
        this.caregiverEmail = caregiverEmail;
        this.caregiverStreetAddress = caregiverStreetAddress;
        this.caregiverCity = caregiverCity;
        this.caregiverState = caregiverState;
        this.caregiverCountry = caregiverCountry;
        this.caregiverZip = caregiverZip;

        this.documents = documents;
        this.dbAccess = clientPortalAccess;
        this.stage = stage;
        this.isVerified = isVerified ?? false;
        this.isDeleted = isDeleted ?? false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.password = password;
        this.tenantId = tenantId;
        this.createdBy = createdBy;
        this.assignToClinicians = assignToClinicians;
    }

    get createClient() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            preferredName: this.preferredName,

            email: this.email,
            phoneNumber: this.phoneNumber,

            DOB: this.DOB,
            gender: this.gender,
            primaryPayer: this.primaryPayer,

            streetAddress: this.streetAddress,
            city: this.city,
            state: this.state,
            country: this.country,
            zipCode: this.zipCode,

            caregiverName: this.caregiverName,
            caregiverRelationship: this.caregiverRelationship,
            caregiverPhone: this.caregiverPhone,
            caregiverEmail: this.caregiverEmail,
            caregiverStreetAddress: this.caregiverStreetAddress,
            caregiverCity: this.caregiverCity,
            caregiverState: this.caregiverState,
            caregiverCountry: this.caregiverCountry,
            caregiverZip: this.caregiverZip,

            documents: this.documents,

            password: this.password,
        };
    }

    get createClientTenant() {
        return {
            clientId: this.clientId,
            tenantId: this.tenantId,
            dbAccess: this.dbAccess,
            stage: "UNVERIFIED",
            createdBy: this.createdBy,
            clinicians: {
                connect: this.assignToClinicians
            },
        };
    }

}

export default Client;