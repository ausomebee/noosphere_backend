import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportHistoryService from "../../application/reportHistoryService.js";
import ClinicalReportHistoryRepository from "../../infrastructure/reportHistoryRepository.js";

class ClinicalReportHistoryController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new ClinicalReportHistoryRepository(
            this.prisma.clinicalReportHistory
        );

        this.service = new ClinicalReportHistoryService({
            repository: this.repository
        });
    }

    createHistory = expressAsyncHandler(async (req, res) => {
        const data = new ClinicalReportHistory(req.body);
        const record = await this.service.createHistory(data.createHistory);

        if (!record) {
            return res.status(500).json({ message: "Failed to create report history" });
        }

        return res.status(201).json({
            message: "Report history created successfully",
            status: "ok",
            data: record
        });
    });

    getSingleHistory = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getHistory(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch report history" });
        }

        return res.status(200).json({
            message: "Report history fetched successfully",
            status: "ok",
            data: record
        });
    });

    getReportHistories = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getHistories(req.params.clinicalReportId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch report histories" });
        }

        return res.status(200).json({
            message: "Report histories fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default ClinicalReportHistoryController;
