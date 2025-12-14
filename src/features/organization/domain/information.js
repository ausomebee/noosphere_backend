class Information {
    constructor({ id, tenantId, name, email, phoneNumber, website, practiceNPI, streetAddress, city, state, country, zipCode, subDomain }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.website = website;
        this.practiceNPI = practiceNPI;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
        this.subDomain = subDomain;
    }

    get createInformation() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            email: this.email,
            phoneNumber: this.phoneNumber,
            website: this.website,
            practiceNPI: this.practiceNPI,
            streetAddress: this.streetAddress,
            city: this.city,
            state: this.state,
            country: this.country,
            zipCode: this.zipCode,
            subDomain: this.subDomain
        };
    }

}

export default Information;