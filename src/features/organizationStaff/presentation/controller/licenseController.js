import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import LicenseRepository from "../../infrastructure/licenseRepository.js";
import LicenseService from "../../application/licenseService.js";

class LicenseController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.licenseRepository = new LicenseRepository(this.prisma.tenantStaffLicenses);
        this.service = new LicenseService({
            licenseRepository: this.licenseRepository
        });
    }

    updateLicense = expressAsyncHandler(async (req, res) => {
        const payload = {
            ...req.params,
            ...req.body,
            isDeleted: req.params.isDeleted === "true"
        };
        const license = await this.service.updateLicense(payload);

        if (!license) {
            res.status(500).json({ message: "Failed to update license" });
        }

        return res.status(200).json({
            message: "License updated successfully",
            status: "ok",
            data: license,
        });
    });

    getTenantStaffLicenses = expressAsyncHandler(async (req, res) => {
        const licenses = await this.service.getTenantStaffLicenses(req.params.tenantStaffId);

        if (!licenses) {
            res.status(404).json({ message: "Licenses not found" });
        }

        return res.status(200).json({
            message: "Licenses retrieved successfully",
            status: "ok",
            data: licenses,
        });
    });

    getLicense = expressAsyncHandler(async (req, res) => {
        const license = await this.service.getLicense(req.params.id);

        if (!license) {
            res.status(404).json({ message: "License not found" });
        }

        return res.status(200).json({
            message: "License retrieved successfully",
            status: "ok",
            data: license,
        });
    });

    createStaffLicense = expressAsyncHandler(async (req, res) => {
        const document = await this.service.createStaffLicense(req.body);

        if (!document) {
            res.status(404).json({ message: "Document creation failed" });
        }

        return res.status(200).json({
            message: "Document created successfully",
            status: "ok",
            data: document,
        });
    });
}

export default LicenseController;