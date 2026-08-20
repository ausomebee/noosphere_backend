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
import ClinicalReportNotificationService from "../../application/clinicalReportNotificationService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import { NotificationType } from "../../../notifications/domain/notificationTypes.js";

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

        this.notificationService = new NotificationService({
            notificationRepository: new NotificationsRepository(this.prisma.notification)
        });
        this.reportNotificationService = new ClinicalReportNotificationService({
            prisma: this.prisma,
            notificationService: this.notificationService
        });

    }

    createChangeRequest = expressAsyncHandler(async (req, res) => {
        const data = new ClinicalReportChangeRequest(req.body);
        const record = await this.service.createChangeRequest(
            data.createChangeRequest
        );

        if (!record) {
            return res
                .status(500)
                .json({ message: "Failed to create report change request" });
        }

        const updated = await this.reportService.updateReport({
            id: record.clinicalReportId,
            status: record.approverId ? "DRAFT" : "CHANGES_REQUESTED"
        });

        const history = new ClinicalReportHistory({
            clinicalReportId: updated.id,
            action: updated.status,
            createdBy: updated.creatorId
        });

        await this.historyService.createHistory(history.createHistory);

        await this.reportNotificationService.notifyStaff({
            report: await this.reportService.getReportForExport(updated.id),
            staffId: updated.creatorId,
            type: record.approverId
                ? NotificationType.REPORT_CHANGE_REQUESTED_BY_SUPERVISOR
                : NotificationType.CLIENT_REPORT_CHANGE_REQUEST,
            title: record.approverId
                ? "Approver requested clinical report changes"
                : "Client requested clinical report changes",
            content: record.approverId
                ? `The approver returned "${updated.title}" for changes: ${record.description}`
                : `The client returned "${updated.title}" for changes: ${record.description}`,
            subject: record.approverId
                ? `Changes requested by approver: ${updated.title}`
                : `Changes requested by client: ${updated.title}`,
            metadata: { changeRequestId: record.id }
        });

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

    markAsViewed = expressAsyncHandler(async (req, res) => {
        const record = await this.service.markAsViewed(req.params.id);

        if (!record) {
            return res
                .status(500)
                .json({ message: "Failed to mark report change request as viewed" });
        }

        return res.status(200).json({
            message: "Report change request marked as viewed",
            status: "ok",
            data: record
        });
    });

}

export default ClinicalReportChangeRequestController;
