import RoleRepository from "../infrastructure/roleRepository.js";

class RoleService {
    constructor() {
        this.repository = new RoleRepository()
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
}

export default RoleService;