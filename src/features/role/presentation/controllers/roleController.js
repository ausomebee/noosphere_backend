import expressAsyncHandler from "express-async-handler";
import RoleService from "../../application/roleService.js";
import Role from "../../domain/role.js";
import RoleModuleAccessRepository from "../../infrastructure/roleModuleAccessRepository.js";
import RoleModuleAccessService from "../../application/roleModuleAccessService.js";

class RoleController {
    constructor() {
        this.service = new RoleService();
        this.roleModuleAccessrepository = new RoleModuleAccessRepository(this.prisma.roleModuleAccess);
        this.roleModuleAccessService = new RoleModuleAccessService({
            roleModuleAccessRepository: this.roleModuleAccessrepository
        });
    }

    createAdminRole = expressAsyncHandler(async (req, res) => {
        const roleData = new Role(req.body);
        const role = await this.service.createAdminRole(roleData.adminCreateRole);

        if (!role) {
            res.status(500).json({ message: 'Failed to create role' });
        }

        return res.status(201).json({
            message: "Role created successfully",
            status: 'ok',
            data: role
        });
    });

    getRoles = expressAsyncHandler(async (req, res) => {
        const roles = await this.service.getRoles(req.params);

        if (!roles) {
            res.status(500).json({ message: 'Failed to get roles' });
        }

        return res.status(201).json({
            message: "Roles fetched successfully",
            status: 'ok',
            data: roles
        });
    });

    createTenantRole = expressAsyncHandler(async (req, res) => {
        console.log(req.body)
        const roleData = new Role(req.body);
        const role = await this.service.createTenantRole(roleData.tenantCreateRole);

        if (!role) {
            res.status(500).json({ message: 'Failed to create role' });
        }

        return res.status(201).json({
            message: "Role created successfully",
            status: 'ok',
            data: role
        });
    });

    createRole = expressAsyncHandler(async (req, res) => {
        const roleData = new Role(req.body);
        const role = await this.service.createRole(roleData.createRole);

        if (!role) {
            res.status(500).json({ message: 'Failed to create role' });
        }

        for (const moduleAccess of roleData.createRole.moduleAccesses) {
            await this.roleModuleAccessService.createRoleModuleAccess({
                roleId: role.id,
                module: moduleAccess.module,
                permissions: moduleAccess.permissions,
            });
        }

        return res.status(201).json({
            message: "Role created successfully",
            status: 'ok',
            data: role
        });
    });
}

export default RoleController;