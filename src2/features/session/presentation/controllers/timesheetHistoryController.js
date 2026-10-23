import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import TimesheetHistoryRepository from "../../infrastructure/timesheetHistoryRepository.js";
import TimesheetHistoryService from "../../application/timesheetHistoryService.js";
import TimesheetHistory from "../../domain/timesheetHistory.js";

class TimesheetHistoryController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new TimesheetHistoryRepository(this.prisma.timesheetHistory);
        this.service = new TimesheetHistoryService({ timesheetHistoryRepository: this.repository });
    }

    createTimesheetHistory = expressAsyncHandler(async (req, res) => {
        const data = new TimesheetHistory(req.body);
        const newRecord = await this.service.createTimesheetHistory(data.createTimesheetHistory);

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create timesheet history" });
        }

        return res.status(201).json({
            message: "Timesheet history created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateTimesheetHistory = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateTimesheetHistory(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update timesheet history" });
        }

        return res.status(200).json({
            message: "Timesheet history updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleTimesheetHistory = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleTimesheetHistory(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Timesheet history not found" });
        }

        return res.status(200).json({
            message: "Timesheet history fetched successfully",
            status: "ok",
            data: record
        });
    });

    getTimesheetHistories = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getTimesheetHistories(req.params.sessionId);

        if (!records) {
            return res.status(404).json({ message: "No timesheet histories found" });
        }

        return res.status(200).json({
            message: "Timesheet histories fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default TimesheetHistoryController;
