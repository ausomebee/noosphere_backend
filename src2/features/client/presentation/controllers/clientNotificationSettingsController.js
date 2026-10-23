import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClientNotificationSettingsRepository from "../../infrastructure/clientNotificationSettingsRepository.js";
import ClientNotificationSettingsService from "../../application/clientNotificationSettingsService.js";
import ClientNotificationSettings from "../../domain/clientNotificationSettings.js";

class ClientNotificationSettingsController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.clientNotificationSettingsRepository =
            new ClientNotificationSettingsRepository(
                this.prisma.clientNotificationSettings
            );

        this.service = new ClientNotificationSettingsService({
            clientNotificationSettingsRepository:
                this.clientNotificationSettingsRepository
        });
    }

    createNotificationSettings = expressAsyncHandler(async (req, res) => {
        const data = new ClientNotificationSettings(req.body);

        const newRecord = await this.service.createNotificationSettings(
            data.createNotificationSettings
        );

        return res.status(201).json({
            message: "Notification settings created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateNotificationSettings = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateNotificationSettings({
            id: req.params.id,
            ...req.body
        });

        return res.status(200).json({
            message: "Notification settings updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleNotificationSettings = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleNotificationSettings(
            req.params.id
        );

        return res.status(200).json({
            message: "Notification settings fetched successfully",
            status: "ok",
            data: record
        });
    });

    getNotificationSettingsByClient = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getNotificationSettingsByClient(
            req.params.tenantClientId
        );

        return res.status(200).json({
            message: "Notification settings fetched successfully",
            status: "ok",
            data: record
        });
    });
}

export default ClientNotificationSettingsController;