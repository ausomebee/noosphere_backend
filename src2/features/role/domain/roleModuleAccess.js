class RoleModuleAccess {
    constructor({
        id,
        roleId,
        module,
        permissions
    }) {
        this.id = id;
        this.roleId = roleId;
        this.module = module;
        this.permissions = permissions;
    }

    get createRoleModuleAccess() {
        return {
            roleId: this.roleId,
            module: this.module,
            permissions: this.permissions,
        };
    }

    get updateRoleModuleAccess() {
        return {
            module: this.module,
            permissions: this.permissions,
        };
    }
}

export default RoleModuleAccess;
