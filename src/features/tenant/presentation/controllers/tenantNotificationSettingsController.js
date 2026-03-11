import expressAsyncHandler from "express-async-handler";
import TenantNotificationSettingsRepository from "../../infrastructure/tenantNotificationSettingsRepository.js";
import TenantNotificationSettingsService from "../../application/tenantNotificationSettingsService.js";
import prismaService from "../../../../config/prisma.js";

class TenantNotificationSettingsController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.tenantNotificationSettingsRepository =
            new TenantNotificationSettingsRepository(this.prisma.tenantNotificationSettings);

        this.service = new TenantNotificationSettingsService({
            tenantNotificationSettingsRepository: this.tenantNotificationSettingsRepository
        });
    }

    getNotificationSettings = expressAsyncHandler(async (req, res) => {
        const { userId } = req.params;

        const settings = await this.service.getNotificationSettings(userId);

        if (!settings) {
            return res.status(404).json({
                message: "Notification settings not found",
                status: "error",
                data: null
            });
        }

        return res.status(200).json({
            message: "Notification settings fetched successfully",
            status: "ok",
            data: settings
        });
    });

    saveNotificationSettings = expressAsyncHandler(async (req, res) => {
        const { userId } = req.body;
        const { settings } = req.body;

        if (!settings || typeof settings !== "object") {
            return res.status(400).json({
                message: "Invalid settings payload",
                status: "error",
                data: null
            });
        }

        const { record, isNew } = await this.service.saveNotificationSettings(userId, settings);

        const message = isNew
            ? "Notification settings created successfully"
            : "Notification settings updated successfully";

        return res.status(201).json({
            message,
            status: "ok",
            data: record
        });
    });
}

export default TenantNotificationSettingsController;