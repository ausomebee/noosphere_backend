import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportChangeRequestRepository from "../../infrastructure/reportRequestRepository.js";
import ClinicalReportChangeRequestService from "../../application/reportRequestService.js";
import ClinicalReportChangeRequest from "../../domain/reportRequest.js";
import ClinicalReportService from "../../application/reportService.js";
import ClinicalReportRepository from "../../infrastructure/reportRepository.js";
import ClinicalReportHistory from "../../domain/reportHistory.js";
import ClinicalReportHistoryService from "../../application/reportHistoryService.js";
import ClinicalReportHistoryRepository from "../../infrastructure/reportHistoryRepository.js";

class ClinicalReportChangeRequestController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new ClinicalReportChangeRequestRepository(
            this.prisma.clinicalReportChangeRequest
        );

        this.service = new ClinicalReportChangeRequestService({
            repository: this.repository
        });

        this.reportService = new ClinicalReportService({
            repository: new ClinicalReportRepository(this.prisma.clinicalReport)
        });

        this.historyService = new ClinicalReportHistoryService({
            repository: new ClinicalReportHistoryRepository(
                this.prisma.clinicalReportHistory
            )
        });

    }

    createChangeRequest = expressAsyncHandler(async (req, res) => {
        const data = new ClinicalReportChangeRequest(req.body);
        const record = await this.service.createChangeRequest(
            data.createChangeRequest
        );

        // const status = record.approverId ? "DRAFT" : "AWAITING_SIGNATURE";
        const updated = await this.reportService.updateReport({
            id: record.clinicalReportId,
            status: "CHANGES_REQUESTED"
        });

        const history = new ClinicalReportHistory({
            clinicalReportId: updated.id,
            action: updated.status,
            createdBy: updated.creatorId
        });

        await this.historyService.createHistory(history.createHistory);

        if (!record) {
            return res
                .status(500)
                .json({ message: "Failed to create report change request" });
        }

        return res.status(201).json({
            message: "Report change request created successfully",
            status: "ok",
            data: record
        });
    });

    getSingleChangeRequest = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getChangeRequest(req.params.id);

        if (!record) {
            return res
                .status(500)
                .json({ message: "Failed to fetch report change request" });
        }

        return res.status(200).json({
            message: "Report change request fetched successfully",
            status: "ok",
            data: record
        });
    });

    getReportChangeRequests = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getChangeRequests(req.params.clinicalReportId);

        if (!records) {
            return res.status(500).json({
                message: "Failed to fetch report change requests"
            });
        }

        const formattedRecords = records.map(record => {
            let requester = "";

            if (record.client?.client) {
                requester = `${record.client.client.firstName} ${record.client.client.lastName}`;
            } else if (record.approver?.fullName) {
                requester = record.approver.fullName;
            }

            return {
                ...record,
                requester
            };
        });

        return res.status(200).json({
            message: "Report change requests fetched successfully",
            status: "ok",
            data: formattedRecords
        });
    });

}

export default ClinicalReportChangeRequestController;
