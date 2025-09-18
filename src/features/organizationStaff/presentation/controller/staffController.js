import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DocumentRepository from "../../infrastructure/documentRepository.js";
import TenantStaffService from "../../application/staffService.js";
import StaffRepository from "../../infrastructure/staffRepository.js";
import LicenseRepository from "../../infrastructure/licenseRepository.js";
import PayrollRepository from "../../infrastructure/payrollRepository.js";

class TenantStaffController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.documentRepository = new DocumentRepository(this.prisma.tenantStaffDocuments);
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.licenseRepository = new LicenseRepository(this.prisma.tenantStaffLicenses);
        this.payrollRepository = new PayrollRepository(this.prisma.tenantStaffPayroll);
        this.service = new TenantStaffService({ documentRepository: this.documentRepository, staffRepository: this.staffRepository, licenseRepository: this.licenseRepository, payrollRepository: this.payrollRepository, prisma: this.prisma });
    }

    createTenantStaff = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.createTenantStaff(req.body);

        if (!staff) {
            res.status(500).json({ message: "Failed to create staff" });
        }

        return res.status(201).json({
            message: "tenant staff created successfully",
            status: "ok",
            data: staff,
        });
    });

    updateTenantStaff = expressAsyncHandler(async (req, res) => {
        const payload = {
            ...req.params,
            ...req.body,
            active: req.params.active === "true"
        };
        const staff = await this.service.updateTenantStaff(payload);

        if (!staff) {
            res.status(500).json({ message: "Failed to update staff" });
        }

        return res.status(200).json({
            message: "Tenant staff updated successfully",
            status: "ok",
            data: staff,
        });
    });

    getTenantStaffs = expressAsyncHandler(async (req, res) => {
        const staffs = await this.service.getTenantStaffs(req.params.tenantId);

        if (!staffs) {
            res.status(404).json({ message: "Staffs not found" });
        }

        return res.status(200).json({
            message: "Tenant staffs retrieved successfully",
            status: "ok",
            data: staffs,
        });
    });

    getStaff = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.getStaff(req.params.id);

        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
        }

        return res.status(200).json({
            message: "Tenant staff retrieved successfully",
            status: "ok",
            data: staff,
        });
    });

    getStaffDetails = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.getStaffDetails(req.params.id);

        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
        }

        return res.status(200).json({
            message: "Tenant staff retrieved successfully",
            status: "ok",
            data: staff,
        });
    });

}

export default TenantStaffController;