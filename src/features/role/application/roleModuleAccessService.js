class RoleModuleAccessService {
    constructor({ roleModuleAccessRepository }) {
        this.roleModuleAccessRepository = roleModuleAccessRepository;
    }

    async createRoleModuleAccess(data) {
        console.log("Creating role module access with data:", data);
//         const exists = await this.roleModuleAccessRepository.findFirstDynamic({
//             where: { roleId: data.roleId, module: data.module },
//             select: { id: true }
//         });
// console.log("Existing access found:", exists);
//         if (exists) {
//             throw new Error("Role module access already exists for this role and module.");
//         }

        const newAccess = await this.roleModuleAccessRepository.create(data);
console.log(newAccess)
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
