import expressAsyncHandler from "express-async-handler";
import RoleService from "../../application/roleService.js";
import Role from "../../domain/role.js";

class RoleController {
    constructor() {
        this.service = new RoleService();
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

    // createClientRole = expressAsyncHandler(async (req, res) => {
    //     const roleData = new Role(req.body);
    //     const role = await this.service.createAdminRole(roleData.tenantCreateRole);

    //     if (!role) {
    //         res.status(500).json({ message: 'Failed to create role' });
    //     }

    //     return res.status(201).json({
    //         message: "Role created successfully",
    //         status: 'ok',
    //         data: role
    //     });
    // });
}

export default RoleController;