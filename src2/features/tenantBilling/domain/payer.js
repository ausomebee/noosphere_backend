class Payer {
    constructor({
        id,
        tenantId,
        payerName,
        email,
        phone,
        insuranceTypeId,
        tplCode,
        carrierPayerId,
        address,
        city,
        state,
        zip,
        country,
        serviceCodes,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.payerName = payerName;
        this.email = email;
        this.phone = phone;
        this.insuranceTypeId = insuranceTypeId;
        this.tplCode = tplCode;
        this.carrierPayerId = carrierPayerId;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.serviceCodes = serviceCodes;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createPayer() {
        return {
            tenantId: this.tenantId,
            payerName: this.payerName,
            email: this.email,
            phone: this.phone,
            insuranceTypeId: this.insuranceTypeId,
            tplCode: this.tplCode,
            carrierPayerId: this.carrierPayerId,
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
            serviceCodes: this.serviceCodes,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }

    get updatePayer() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            payerName: this.payerName,
            email: this.email,
            phone: this.phone,
            insuranceTypeId: this.insuranceTypeId,
            tplCode: this.tplCode,
            carrierPayerId: this.carrierPayerId,
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
            serviceCodes: this.serviceCodes,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default Payer;
