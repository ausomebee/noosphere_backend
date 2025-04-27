class Role {
    constructor({ id, name, description, access, departmentId }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.access = access;
        this.departmentId = departmentId;
    }

    get adminCreateRole() {
        return {
            name: this.name,
            departmentId: this.departmentId,
            description: this.description,
            access: this.access
        };
    }

    get tenantCreateRole() {
        return {
            name: this.name,
            departmentId: this.departmentId,
            description: this.description,
            access: this.access
        };
    }
}

export default Role;