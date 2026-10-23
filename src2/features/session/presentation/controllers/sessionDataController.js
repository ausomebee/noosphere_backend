import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import SessionDataRepository from "../../infrastructure/sessionDataRepository.js";
import SessionDataService from "../../application/sessionDataService.js";
import SessionData from "../../domain/sessionData.js";

class SessionDataController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new SessionDataRepository(this.prisma.sessionData);
        this.service = new SessionDataService({ sessionDataRepository: this.repository });
    }

    createSessionData = expressAsyncHandler(async (req, res) => {
        const data = new SessionData(req.body);
        const newRecord = await this.service.createSessionData(data.createSessionData);

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create session data" });
        }

        return res.status(201).json({
            message: "Session data created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateSessionData = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateSessionData(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update session data" });
        }

        return res.status(200).json({
            message: "Session data updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleSessionData = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleSessionData(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Session data not found" });
        }

        return res.status(200).json({
            message: "Session data fetched successfully",
            status: "ok",
            data: record
        });
    });

    getSessionDatas = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getSessionData(req.params.sessionId);

        if (!records) {
            return res.status(404).json({ message: "No session data found" });
        }

        return res.status(200).json({
            message: "Session data fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default SessionDataController;
