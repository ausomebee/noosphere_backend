import expressAsyncHandler from "express-async-handler";
import RoleService from "../../application/roleService.js";
import Role from "../../domain/role.js";
import RoleModuleAccessRepository from "../../infrastructure/roleModuleAccessRepository.js";
import RoleModuleAccessService from "../../application/roleModuleAccessService.js";
import prismaService from "../../../../config/prisma.js";

class RoleController {
    constructor() {
        this.prisma = prismaService.getClient();
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

    getRole = expressAsyncHandler(async (req, res) => {
        const role = await this.service.getRole(req.params.id);

        if (!role) {
            res.status(500).json({ message: 'Failed to get role' });
        }

        return res.status(201).json({
            message: "Role fetched successfully",
            status: 'ok',
            data: role
        });
    });

    deactivateRole = expressAsyncHandler(async (req, res) => {
        const role = await this.service.updateRole({
            id: req.params.id,
            isActive: false
        });

        if (!role) {
            res.status(500).json({ message: 'Failed to deactivate role' });
        }

        return res.status(201).json({
            message: "Role deactivated successfully",
            status: 'ok',
            data: role
        });
    });

    getRolesByModule = expressAsyncHandler(async (req, res) => {
        const roles = await this.service.getRolesByModule(req.params.systemModule, req.params.tenantId);

        if (!roles) {
            res.status(500).json({ message: 'Failed to get roles by module' });
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
        console.log(JSON.stringify(req.body, null, 2));
        const roleData = new Role(req.body);
        const role = await this.service.createRole(roleData.createRole);

        if (!role) {
            res.status(500).json({ message: 'Failed to create role' });
        }
console.log(role, req.body.moduleAccesses)
        for (const moduleAccess of req.body.moduleAccesses) {
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

    updateRole = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const roleData = new Role(data);

        const updatedRole = await this.service.updateRole(roleData.updateRole);

        if (!updatedRole) {
            return res.status(500).json({ message: "Failed to update role" });
        }

        if (Array.isArray(data.moduleAccesses) && data.moduleAccesses.length > 0) {
            for (const access of data.moduleAccesses) {
                if (access.id) {
                    await this.roleModuleAccessService.updateRoleModuleAccess({
                        id: access.id,
                        permissions: access.permissions,
                        module: access.module
                    });
                } else {
                    await this.roleModuleAccessService.createRoleModuleAccess({
                        roleId: updatedRole.id,
                        module: access.module,
                        permissions: access.permissions
                    });
                }
            }
        }

        return res.status(200).json({
            message: "Role and module accesses updated successfully",
            status: "ok",
            data: updatedRole
        });
    });

}

export default RoleController;