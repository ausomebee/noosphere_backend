import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DepartmentMembersService from "../../application/departmentMembersService.js";
import DepartmentMembers from "../../domain/departmentMembers.js";
import DepartmentMembersRepository from "../../infrastructure/departmentMembersRepository.js";

class DepartmentMembersController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.departmentMembersRepository = new DepartmentMembersRepository(
            this.prisma.departmentMembers
        );
        this.service = new DepartmentMembersService({
            departmentMembersRepository: this.departmentMembersRepository
        });
    }

    createDepartmentMember = expressAsyncHandler(async (req, res) => {
        const data = new DepartmentMembers(req.body);

        const newRecord = await this.service.createDepartmentMember(
            data.createDepartmentMember
        );

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to add department member" });
        }

        return res.status(201).json({
            message: "Department member added successfully",
            status: "ok",
            data: newRecord
        });
    });

    removeDepartmentMember = expressAsyncHandler(async (req, res) => {
        const removed = await this.service.removeDepartmentMember(req.params.id);

        if (!removed) {
            return res.status(500).json({ message: "Failed to remove department member" });
        }

        return res.status(200).json({
            message: "Department member removed successfully",
            status: "ok",
            data: removed
        });
    });

    getDepartmentMembers = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getDepartmentMembers(req.params.departmentId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch department members" });
        }

        return res.status(200).json({
            message: "Department members fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default DepartmentMembersController;
