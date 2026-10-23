import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TenantAdditionalSecurityQuestionsService from "../../application/tenantAdditionalSecurityQuestionsService.js";
import TenantAdditionalSecurityQuestions from "../../domain/tenantAdditionalSecurityQuestions.js";
import TenantAdditionalSecurityQuestionsRepository from "../../infrastructure/tenantAdditionalSecurityQuestionsRepository.js";

class TenantAdditionalSecurityQuestionsController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.repository = new TenantAdditionalSecurityQuestionsRepository(
            this.prisma.tenantAdditionalSecurityQuestions
        );

        this.service = new TenantAdditionalSecurityQuestionsService({
            repository: this.repository
        });
    }

    createQuestion = expressAsyncHandler(async (req, res) => {
        const data = new TenantAdditionalSecurityQuestions(req.body);
        const record = await this.service.createQuestion(data.createQuestion);

        if (!record) {
            return res.status(500).json({ message: "Failed to create security question" });
        }

        return res.status(201).json({
            message: "Security question created successfully",
            status: "ok",
            data: record
        });
    });

    updateQuestion = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateQuestion(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update security question" });
        }

        return res.status(200).json({
            message: "Security question updated successfully",
            status: "ok",
            data: updated
        });
    });

    getQuestion = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getQuestion(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Security question not found" });
        }

        return res.status(200).json({
            message: "Security question fetched successfully",
            status: "ok",
            data: record
        });
    });

    getQuestions = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getQuestions(req.params.tenantId);

        return res.status(200).json({
            message: "Security questions fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default TenantAdditionalSecurityQuestionsController;
