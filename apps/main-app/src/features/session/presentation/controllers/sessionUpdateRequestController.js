import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import SessionUpdateRequestRepository from "../../infrastructure/sessionUpdateRequestRepository.js";
import SessionUpdateRequestService from "../../application/sessionUpdateRequestService.js";
import SessionUpdateRequest from "../../domain/sessionUpdateRequest.js";

class SessionUpdateRequestController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new SessionUpdateRequestRepository(this.prisma.sessionUpdateRequest);
        this.service = new SessionUpdateRequestService({
            sessionUpdateRequestRepository: this.repository
        });
    }

    createSessionUpdateRequest = expressAsyncHandler(async (req, res) => {
        const data = new SessionUpdateRequest(req.body);
        const newRecord = await this.service.createUpdateRequest(data.createSessionUpdateRequest);

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create session update request" });
        }

        return res.status(201).json({
            message: "Session update request created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateSessionUpdateRequest = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateUpdateRequest(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update session update request" });
        }

        return res.status(200).json({
            message: "Session update request updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleSessionUpdateRequest = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleUpdateRequest(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Session update request not found" });
        }

        return res.status(200).json({
            message: "Session update request fetched successfully",
            status: "ok",
            data: record
        });
    });

    getSessionUpdateRequests = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getUpdateRequests(req.params.sessionId);

        if (!records) {
            return res.status(404).json({ message: "No session update requests found" });
        }

        return res.status(200).json({
            message: "Session update requests fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default SessionUpdateRequestController;
