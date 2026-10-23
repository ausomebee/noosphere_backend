import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TenantGeneralSettingsRepository from "../../infrastructure/tenantGeneralSettingsRepository.js";
import TenantGeneralSettingsService from "../../application/tenantGeneralSettingsService.js";
import TenantGeneralSettings from "../../domain/tenantGeneralSettings.js";

class TenantGeneralSettingsController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new TenantGeneralSettingsRepository(
            this.prisma.tenantGeneralSettings
        );

        this.service = new TenantGeneralSettingsService({
            repository: this.repository
        });
    }

    createSettings = expressAsyncHandler(async (req, res) => {
        const data = new TenantGeneralSettings(req.body);
        const record = await this.service.createSettings(data.createSettings);

        if (!record) {
            return res.status(500).json({ message: "Failed to create tenant settings" });
        }

        return res.status(201).json({
            message: "Tenant settings created successfully",
            status: "ok",
            data: record
        });
    });

    updateSettings = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateSettings(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update tenant settings" });
        }

        return res.status(200).json({
            message: "Tenant settings updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSettings = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSettings(req.params.tenantId);

        if (!record) {
            return res.status(404).json({ message: "Tenant settings not found" });
        }

        return res.status(200).json({
            message: "Tenant settings fetched successfully",
            status: "ok",
            data: record
        });
    });
}

export default TenantGeneralSettingsController;
