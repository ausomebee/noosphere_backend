class Role {
    constructor({
        id,
        name,
        dataAccessLevel,
        systemModule,
        createdByAdminId,
        createdByTenantId
    }) {
        this.id = id;
        this.name = name;
        this.dataAccessLevel = dataAccessLevel;
        this.systemModule = systemModule;
        this.createdByAdminId = createdByAdminId;
        this.createdByTenantId = createdByTenantId;
    }

    get adminCreateRole() {
        return {
            name: this.name,
            dataAccessLevel: this.dataAccessLevel,
            systemModule: this.systemModule,
            createdByAdminId: this.createdByAdminId,
            createdByTenantId: this.createdByTenantId,
        };
    }

    get createRole() {
        return {
            name: this.name,
            dataAccessLevel: this.dataAccessLevel,
            systemModule: this.systemModule,
            createdByAdminId: this.createdByAdminId,
            createdByTenantId: this.createdByTenantId,
        };
    }

    get tenantCreateRole() {
        return {
            name: this.name,
            dataAccessLevel: this.dataAccessLevel,
            systemModule: this.systemModule,
            createdByAdminId: this.createdByAdminId,
            createdByTenantId: this.createdByTenantId,
        };
    }

    get updateRole() {
        return {
            name: this.name,
            dataAccessLevel: this.dataAccessLevel,
            systemModule: this.systemModule,
            createdByAdminId: this.createdByAdminId,
            createdByTenantId: this.createdByTenantId,
        };
    }
}

export default Role;
