class Department {
    constructor({ id, name, module, description, access, createdByAdminId, createdByTenantId }) {
        this.id = id;
        this.name = name;
        this.module = module;
        this.description = description;
        this.access = access;
        this.createdByAdminId = createdByAdminId;
        this.createdByTenantId = createdByTenantId;
    }

    get adminCreateDepartment() {
        return {
            name: this.name,
            module: this.module,
            createdByAdminId: this.createdByAdminId,
            description: this.description,
            access: this.access
        };
    }

    get tenantCreateDepartment() {
        return {
            name: this.name,
            module: this.module,
            createdByTenantId: this.createdByTenantId,
            description: this.description,
            access: this.access
        };
    }

    get tenantId(){
        return{
            createdByTenantId: this.createdByTenantId
        }
    }
}

export default Department;