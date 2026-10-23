class Domain {
    constructor({name, id, description, tenantId, domainType}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tenantId = tenantId;
        this.domainType = domainType;
    }

    get createDomain() {
        return {
            name: this.name,
            description: this.description,
            tenantId: this.tenantId,
            domainType: this.domainType,
        };
    }
}

export default Domain;