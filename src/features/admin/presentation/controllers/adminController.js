import expressAsyncHandler from "express-async-handler";
import AdminService from "../../application/adminService.js";
import Admin from "../../domain/admin.js";

class AdminController {
    constructor() {
        this.service = new AdminService();
    }

    createAdmin = expressAsyncHandler(async (req, res) => {
        const adminData = new Admin(req.body);
        const admin = await this.service.createAdmin(adminData.createAdmin);

        if (!admin) {
            res.status(500).json({ message: 'Failed to create admin' });
        }

        return res.status(201).json({
            message: "Admin created successfully",
            status: 'ok',
            data: admin
        });
    });

    createSuperAdmin = expressAsyncHandler(async (req, res) => {
        const adminData = new Admin(req.body);
        const admin = await this.service.createSuperAdmin(adminData.createAdmin);

        if (!admin) {
            res.status(500).json({ message: 'Failed to create super admin' });
        }

        return res.status(201).json({
            message: "Super admin created successfully",
            status: 'ok',
            data: admin
        });
    });

    updateAdmin = expressAsyncHandler(async (req, res) => {
        const admin = await this.service.updateAdmin(req.body);

        if (!admin) {
            res.status(500).json({ message: 'Failed to update admin' });
        }

        return res.status(201).json({
            message: "Admin updated successfully",
            status: 'ok',
            data: admin
        });
    });

    adminSignin = expressAsyncHandler(async (req, res) => {
        const admin = await this.service.AdminSignin(req.body);

        if (!admin) {
            res.status(500).json({ message: 'Failed to signin admin' });
        }

        return res.status(201).json({
            message: "Admin login successfully",
            status: 'ok',
            data: admin
        });
    });

    getSingleAdmin = expressAsyncHandler(async (req, res) => {
        const admin = await this.service.getSingleAdmin(req.params);

        if (!admin) {
            res.status(500).json({ message: 'Failed to get admin' });
        }

        return res.status(201).json({
            message: "Admin fetched successfully",
            status: 'ok',
            data: admin
        });
    });

    superAdminChoices = expressAsyncHandler(async (req, res) => {
        const choice = await this.service.superAdminChoices(req.body);

        if (!choice) {
            res.status(500).json({ message: 'Failed to create choice' });
        }

        return res.status(201).json({
            message: "Choice created successfully",
            status: 'ok',
            data: choice
        });
    });

    getChoices = expressAsyncHandler(async (req, res) => {
        const choice = await this.service.getSingleAdmin();

        if (!choice) {
            res.status(500).json({ message: 'Failed to get choice' });
        }

        return res.status(201).json({
            message: "choice fetched successfully",
            status: 'ok',
            data: choice
        });
    });

    forgotPassword = expressAsyncHandler(async (req, res) => {
        const mail = await this.service.forgotPassword(req.params);

        if (!mail) {
            res.status(500).json({ message: 'Failed to send mail' });
        }

        return res.status(201).json({
            message: "mail sent successfully",
            status: 'ok',
            data: mail
        });
    });
}

export default AdminController;