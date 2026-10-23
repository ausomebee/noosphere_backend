import RoleRepository from "../infrastructure/roleRepository.js";

class RoleService {
    constructor() {
        this.repository = new RoleRepository()
    }

    isProtectedTenantAdminRole(role) {
        return role.name?.trim().toLowerCase() === "admin" &&
            role.systemModule === "TENANT" &&
            role.dataAccessLevel === "GLOBAL" &&
            Boolean(role.createdByTenantId);
    }

    async createAdminRole(data) {
        const roleExist = await this.repository.findFirst({
            where: {
                AND: [
                    { name: data.name },
                    { departmentId: data.departmentId }
                ]
            },
            include: {
                department: true
            }
        });

        if (roleExist) {
            throw new Error("This role already exists.");
        }

        const newRole = await this.repository.create(data);

        if (!newRole) {
            throw new Error("Failed to create role");
        }

        return newRole;
    }

    async getRoles(data) {
        const role = await this.repository.findAll({ departmentId: data.departmentId });

        if (!role) {
            throw new Error("Failed to fetch roles");
        }

        return role;
    }

    async updateRole(data) {
        const role = await this.repository.findOne({ id: data.id });

        if (!role) {
            throw new Error("Role not found.");
        }

        if (data.actorTenantId && role.createdByTenantId !== data.actorTenantId) {
            throw new Error("Forbidden: You cannot modify a role belonging to another tenant.");
        }

        if (this.isProtectedTenantAdminRole(role)) {
            if (data.isActive === false) {
                throw new Error("Forbidden: The default tenant Admin role cannot be deactivated or deleted.");
            }

            if (data.name && data.name.trim().toLowerCase() !== "admin") {
                throw new Error("Forbidden: The default tenant Admin role cannot be renamed.");
            }

            if (data.systemModule && data.systemModule !== "TENANT") {
                throw new Error("Forbidden: The default tenant Admin role cannot change its system module.");
            }

            if (data.dataAccessLevel && data.dataAccessLevel !== "GLOBAL") {
                throw new Error("Forbidden: The default tenant Admin role must retain global data access.");
            }
        }

        const updatedRole = await this.repository.update(data.id, {
            name: data.name ?? role.name,
            dataAccessLevel: data.dataAccessLevel ?? role.dataAccessLevel,
            systemModule: data.systemModule ?? role.systemModule,
            isActive: data.isActive ?? role.isActive
        });

        if (!updatedRole) {
            throw new Error("Failed to update role.");
        }

        return updatedRole;
    }

    async getRole(id) {
        const role = await this.repository.findOne({ id });
        if (!role) {
            throw new Error("Failed to fetch role");
        }

        return role;
    }

    async createTenantRole(data) {
        const roleExist = await this.repository.findFirst({
            where: {
                AND: [
                    { name: data.name },
                    { departmentId: data.departmentId }
                ]
            }
        });

        if (roleExist) {
            throw new Error("This role already exists.");
        }

        const newRole = await this.repository.create(data);

        if (!newRole) {
            throw new Error("Failed to create role");
        }

        return newRole;
    }

    async createRole(data) {
        const newRole = await this.repository.create(data);

        if (!newRole) {
            throw new Error("Failed to create role");
        }

        return newRole;
    }

    async getRolesByModule(systemModule, tenantId) {
        const query = { systemModule };

        if (tenantId) {
            query.createdByTenantId = tenantId;
        }

        const role = await this.repository.findAll(query);

        if (!role) {
            throw new Error("Failed to fetch roles");
        }

        return role;
    }
}

export default RoleService;
