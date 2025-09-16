class OrganizationSessionType {
    constructor({ 
        id, 
        tenantId, 
        name, 
        category, 
        service, 
        staffRolesAllowed, 
        locationsAllowed, 
        defaultDuration, 
        isActive, 
        isBillable 
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.category = category;
        this.service = service;
        this.staffRolesAllowed = staffRolesAllowed;
        this.locationsAllowed = locationsAllowed;
        this.defaultDuration = defaultDuration;
        this.isActive = isActive;
        this.isBillable = isBillable;
    }

    get createOrganizationSessionTypes() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            category: this.category,
            service: this.service,
            staffRolesAllowed: this.staffRolesAllowed,
            locationsAllowed: this.locationsAllowed,
            defaultDuration: this.defaultDuration,
            isActive: this.isActive,
            isBillable: this.isBillable
        };
    }
}

export default OrganizationSessionType;
