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

    getAdminDepartment = expressAsyncHandler(async (req, res) => {
        const department = await this.service.getAdminDepartments();

        if (!department) {
            res.status(500).json({ message: 'Failed to get department' });
        }

        return res.status(201).json({
            message: "Department fetched successfully",
            status: 'ok',
            data: department
        });
    });

    tenantCreateDepartment = expressAsyncHandler(async (req, res) => {
        const departmentData = new Department(req.body);
        const department = await this.service.tenantCreateDepartment(departmentData.tenantCreateDepartment);

        if (!department) {
            res.status(500).json({ message: 'Failed to create department' });
        }

        return res.status(201).json({
            message: "Department created successfully",
            status: 'ok',
            data: department
        });
    });

    tenantGetDepartment = expressAsyncHandler(async (req, res) => {
        const department = await this.service.tenantGetDepartments(req.params);

        if (!department) {
            res.status(500).json({ message: 'Failed to get department' });
        }

        return res.status(201).json({
            message: "Department fetched successfully",
            status: 'ok',
            data: department
        });
    });

    // createClientDepartment = expressAsyncHandler(async (req, res) => {
    //     const departmentData = new Department(req.body);
    //     const department = await this.service.createAdminDepartment(departmentData.tenantCreateDepartment);

    //     if (!department) {
    //         res.status(500).json({ message: 'Failed to create department' });
    //     }

    //     return res.status(201).json({
    //         message: "Department created successfully",
    //         status: 'ok',
    //         data: department
    //     });
    // });

    // getClientDepartment = expressAsyncHandler(async (req, res) => {
    //     const department = await this.service.getClientDepartments(req.params);

    //     if (!department) {
    //         res.status(500).json({ message: 'Failed to get department' });
    //     }

    //     return res.status(201).json({
    //         message: "Department fetched successfully",
    //         status: 'ok',
    //         data: department
    //     });
    // });
}

export default DepartmentController;