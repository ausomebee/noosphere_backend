import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DepartmentRepository from "../../infrastructure/departmentRepository.js";
import DepartmentService from "../../application/departmentService.js";
import Department from "../../domain/department.js";
import DepartmentMembers from "../../domain/departmentMembers.js";
import DepartmentMembersRepository from "../../infrastructure/departmentMembersRepository.js";
import DepartmentMembersService from "../../application/departmentMembersService.js";

class DepartmentController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.departmentRepository = new DepartmentRepository(
            this.prisma.department
        );
        this.service = new DepartmentService({
            departmentRepository: this.departmentRepository
        });
        this.departmentMembersRepository = new DepartmentMembersRepository(
            this.prisma.departmentMembers
        );
        this.departmentMembersService = new DepartmentMembersService({
            departmentMembersRepository: this.departmentMembersRepository
        });
    }

    createDepartment = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const { members = [] } = data;

        const departmentData = new Department(data);

        const department = await this.service.createDepartment(
            departmentData.createDepartment
        );

        if (!department) {
            return res.status(500).json({
                message: "Failed to create department"
            });
        }

        for (const adminId of members) {
            const departmentMemberInstance = new DepartmentMembers({
                departmentId: department.id,
                adminId
            });
console.log("jjjjj",departmentMemberInstance.createDepartmentMember)
            const departmentMember =
                await this.departmentMembersService.createDepartmentMember(
                    departmentMemberInstance.createDepartmentMember
                );

            if (!departmentMember) {
                console.error(`Failed to create department member for staff ${adminId}`);
                continue;
            }
        }

        return res.status(201).json({
            message: "Department created successfully",
            status: "ok",
            data: department
        });
    });

    updateDepartment = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const { members = [], id } = data;

        const department = await this.service.updateDepartment(data);

        if (!department) {
            return res.status(500).json({
                message: "Failed to update department"
            });
        }

        if (members) {
            const existingMembers =
                await this.departmentMembersService.getDepartmentMembers(id);

            const existingAdminIds = existingMembers.map(m => m.adminId);

            const membersToAdd = members.filter(
                adminId => !existingAdminIds.includes(adminId)
            );

            const membersToRemove = existingAdminIds.filter(
                adminId => !members.includes(adminId)
            );

            for (const adminId of membersToAdd) {
                const departmentMemberInstance = new DepartmentMembers({
                    departmentId: id,
                    adminId
                });

                await this.departmentMembersService.createDepartmentMember(
                    departmentMemberInstance.createDepartmentMember
                );
            }

            for (const adminId of membersToRemove) {
                await this.departmentMembersService.removeDepartmentMember(adminId);
            }
        }

        return res.status(200).json({
            message: "Department updated successfully",
            status: "ok",
            data: department
        });
    });

    getSingleDepartment = expressAsyncHandler(async (req, res) => {
        const department = await this.service.getSingleDepartment(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        return res.status(200).json({
            message: "Department fetched successfully",
            status: "ok",
            data: department
        });
    });

    getDepartments = expressAsyncHandler(async (req, res) => {
        const departments = await this.service.getDepartments(
            req.query
        );

        if (!departments) {
            return res.status(404).json({
                message: "No departments found"
            });
        }

        return res.status(200).json({
            message: "Departments fetched successfully",
            status: "ok",
            data: departments
        });
    });

    updateDepartmentActiveStatus = expressAsyncHandler(async (req, res) => {
        const department = await this.service.updateDepartment({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!department) {
            return res.status(500).json({
                message: "Failed to deactivate department"
            });
        }

        return res.status(200).json({
            message: "Department deactivated successfully",
            status: "ok",
            data: department
        });
    });

    deleteDepartment = expressAsyncHandler(async (req, res) => {
        const department = await this.service.updateDepartment({
            id: req.params.id,
            isDeleted: true
        });

        if (!department) {
            return res.status(500).json({
                message: "Failed to delete department"
            });
        }

        return res.status(200).json({
            message: "Department deleted successfully",
            status: "ok",
            data: department
        });
    });
}

export default DepartmentController;
