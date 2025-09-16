import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import LicenseRepository from "../../infrastucture/licenseRepository.js";
import LicenseService from "../../application/licenseService.js";
import License from "../../domain/license.js";

class LicenseController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.licenseRepository = new LicenseRepository(this.prisma.organizationLicenses)
        this.service = new LicenseService({ licenseRepository: this.licenseRepository });
    }

    createLicense = expressAsyncHandler(async (req, res) => {
        const licenseData = new License(req.body);
        const license = await this.service.createLicense(licenseData.createLicense);

        if (!license) {
            res.status(500).json({ message: 'Failed to create license' });
        }

        return res.status(201).json({
            message: "license created successfully",
            status: 'ok',
            data: license
        });
    });

    updateLicense = expressAsyncHandler(async (req, res) => {
        const license = await this.service.updateLicense(req.body);

        if (!license) {
            res.status(500).json({ message: 'Failed to update license' });
        }

        return res.status(201).json({
            message: "license updated successfully",
            status: 'ok',
            data: license
        });
    });

    getSingleLicense = expressAsyncHandler(async (req, res) => {
        const license = await this.service.getSingleLicense(req.params);

        if (!license) {
            res.status(500).json({ message: 'Failed to fetch license' });
        }

        return res.status(201).json({
            message: "license fetched successfully",
            status: 'ok',
            data: license
        });
    });

    getTenantLicense = expressAsyncHandler(async (req, res) => {
        const license = await this.service.getTenantLicenses(req.params.tenantId);

        if (!license) {
            res.status(500).json({ message: 'Failed to fetch license' });
        }

        return res.status(201).json({
            message: "license fetched successfully",
            status: 'ok',
            data: license
        });
    });

    deleteLicense = expressAsyncHandler(async (req, res) => {
        const license = await this.service.updateLicense({id: req.params.id, isDeleted: true});

        if (!license) {
            res.status(500).json({ message: 'Failed to update license' });
        }

        return res.status(201).json({
            message: "license updated successfully",
            status: 'ok',
            data: license
        });
    });
}

export default LicenseController;