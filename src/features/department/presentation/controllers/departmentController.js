import expressAsyncHandler from "express-async-handler";
import DepartmentService from "../../application/departmentService.js";
import Department from "../../domain/department.js";

class DepartmentController {
    constructor() {
        this.service = new DepartmentService();
    }

    createAdminDepartment = expressAsyncHandler(async (req, res) => {
        const departmentData = new Department(req.body);
        const department = await this.service.createAdminDepartment(departmentData.adminCreateDepartment);

        if (!department) {
            res.status(500).json({ message: 'Failed to create department' });
        }

        return res.status(201).json({
            message: "Department created successfully",
            status: 'ok',
            data: department
        });
    });

    createTenantDepartment = expressAsyncHandler(async (req, res) => {
        const departmentData = new Department(req.body);
        const department = await this.service.createAdminDepartment(departmentData.tenantCreateDepartment);

        if (!department) {
            res.status(500).json({ message: 'Failed to create department' });
        }

        return res.status(201).json({
            message: "Department created successfully",
            status: 'ok',
            data: department
        });
    });

    createClientDepartment = expressAsyncHandler(async (req, res) => {
        const departmentData = new Department(req.body);
        const department = await this.service.createAdminDepartment(departmentData.tenantCreateDepartment);

        if (!department) {
            res.status(500).json({ message: 'Failed to create department' });
        }

        return res.status(201).json({
            message: "Department created successfully",
            status: 'ok',
            data: department
        });
    });
}

export default DepartmentController;