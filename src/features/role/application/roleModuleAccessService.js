class RoleModuleAccessService {
    constructor({ roleModuleAccessRepository }) {
        this.roleModuleAccessRepository = roleModuleAccessRepository;
    }

    async createRoleModuleAccess(data) {
        const exists = await this.roleModuleAccessRepository.findFirstDynamic({
            where: { roleId: data.roleId, module: data.module },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Role module access already exists for this role and module.");
        }

        const newAccess = await this.roleModuleAccessRepository.create(data);

        if (!newAccess) {
            throw new Error("Failed to create role module access.");
        }

        return newAccess;
    }

    async updateRoleModuleAccess(data) {
        const access = await this.roleModuleAccessRepository.findOne({ id: data.id });

        if (!access) {
            throw new Error("Role module access not found.");
        }

        const update = await this.roleModuleAccessRepository.update(data.id, {
            permissions: data.permissions ?? access.permissions
        });

        if (!update) {
            throw new Error("Failed to update role module access.");
        }

        return update;
    }

    async upsertRoleModuleAccess(data) {
        let access = null;

        if (data.id) {
            access = await this.roleModuleAccessRepository.findOne({ id: data.id });
        } else if (data.roleId && data.module) {
            access = await this.roleModuleAccessRepository.findFirstDynamic({
                where: { roleId: data.roleId, module: data.module }
            });
        }

        if (access) {
            return await this.roleModuleAccessRepository.update(access.id, {
                module: data.module ?? access.module,
                permissions: data.permissions ?? access.permissions
            });
        }

        return await this.createRoleModuleAccess({
            roleId: data.roleId,
            module: data.module,
            permissions: data.permissions
        });
    }

    async getSingleRoleModuleAccess(id) {
        const access = await this.roleModuleAccessRepository.findOne({ id });

        if (!access) {
            throw new Error("Role module access not found.");
        }

        return access;
    }

    async getRoleModuleAccessByRole(roleId) {
        const accesses = await this.roleModuleAccessRepository.findAllAndPopulate(
            { roleId },
            { role: true }
        );

        if (!accesses) {
            throw new Error("No role module accesses found for this role.");
        }

        return accesses;
    }
}

export default RoleModuleAccessService;
