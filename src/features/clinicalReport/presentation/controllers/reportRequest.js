import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import ClinicalReportChangeRequestRepository from "../../infrastructure/reportRequestRepository.js";
import ClinicalReportChangeRequestService from "../../application/reportRequestService.js";
import ClinicalReportChangeRequest from "../../domain/reportRequest.js";

class ClinicalReportChangeRequestController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new ClinicalReportChangeRequestRepository(
            this.prisma.clinicalReportChangeRequest
        );

        this.service = new ClinicalReportChangeRequestService({
            repository: this.repository
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
        const records = await this.service.getChangeRequests(
            req.params.clinicalReportId
        );

        if (!records) {
            return res
                .status(500)
                .json({ message: "Failed to fetch report change requests" });
        }

        return res.status(200).json({
            message: "Report change requests fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default ClinicalReportChangeRequestController;
