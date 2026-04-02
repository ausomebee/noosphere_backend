import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import RoleModuleAccessRepository from "../../infrastructure/roleModuleAccessRepository.js";
import RoleModuleAccessService from "../../application/roleModuleAccessService.js";
import RoleModuleAccess from "../../domain/roleModuleAccess.js";

class RoleModuleAccessController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new RoleModuleAccessRepository(this.prisma.roleModuleAccess);
        this.service = new RoleModuleAccessService({
            roleModuleAccessRepository: this.repository
        });
    }

    createRoleModuleAccess = expressAsyncHandler(async (req, res) => {
        const data = new RoleModuleAccess(req.body);

        const newRecord = await this.service.createRoleModuleAccess(
            data.createRoleModuleAccess
        );

        if (!newRecord) {
            return res.status(500).json({
                message: "Failed to create role module access"
            });
        }

        return res.status(201).json({
            message: "Role module access created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateRoleModuleAccess = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateRoleModuleAccess(req.body);

        if (!updated) {
            return res.status(500).json({
                message: "Failed to update role module access"
            });
        }

        return res.status(200).json({
            message: "Role module access updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleRoleModuleAccess = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleRoleModuleAccess(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                message: "Role module access not found"
            });
        }

        return res.status(200).json({
            message: "Role module access fetched successfully",
            status: "ok",
            data: record
        });
    });

    getRoleModuleAccessByRole = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getRoleModuleAccessByRole(
            req.params.roleId
        );

        if (!records || records.length === 0) {
            return res.status(404).json({
                message: "No module access found for this role"
            });
        }

        return res.status(200).json({
            message: "Role module accesses fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default RoleModuleAccessController;
