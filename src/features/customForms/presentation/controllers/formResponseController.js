import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import FormResponsesRepository from "../../infrastructure/formResponsesRepository.js";
import FormResponseFieldsRepository from "../../infrastructure/formResponseFieldsRepository.js";
import FormResponseFieldService from "../../application/formResponseFieldService.js";
import FormResponse from "../../domain/formResponse.js";
import FormResponseField from "../../domain/formResponseField.js";
import FormResponseService from "../../application/FormResponseService.js";
import ClientFormRepository from "../../infrastructure/clientFormRepository.js";
import ClientFormService from "../../application/clientFormService.js";

class FormResponseController {
    constructor() {
        this.prisma = prismaService.getClient();

        this.clientFormRepository = new ClientFormRepository(this.prisma.clientForm);
        this.clientFormService = new ClientFormService({ clientFormRepository: this.clientFormRepository });

        const formResponseRepository = new FormResponsesRepository(this.prisma.formResponses);
        const formResponseFieldRepository = new FormResponseFieldsRepository(this.prisma.formResponseFields);

        this.formResponseService = new FormResponseService({ formResponseRepository });
        this.formResponseFieldService = new FormResponseFieldService({ formResponseFieldRepository });
    }

    createFormResponse = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const formResponseData = new FormResponse(data);
        const response = await this.formResponseService.createFormResponse(formResponseData.createFormResponse);

        if (!response) {
            return res.status(500).json({ message: "Failed to create form response" });
        }

        for (const field of data.responseFields || []) {
            const fieldData = new FormResponseField({ ...field, formResponseId: response.id });
            const responseField = await this.formResponseFieldService.createFormResponseField(fieldData.createFormResponseField);

            if (!responseField) {
                return res.status(500).json({ message: "Failed to create form response field" });
            }
        }

        const clientForm = await this.clientFormService.updateClientForm({ formId: data.formId, status: "FILLED" });

        return res.status(201).json({
            message: "Form response created successfully",
            status: "ok",
            data: response
        });
    });

    updateFormResponse = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const formResponseData = new FormResponse(data);
        const updatedResponse = await this.formResponseService.updateFormResponse(formResponseData.updateFormResponse);

        if (!updatedResponse) {
            return res.status(404).json({ message: "Form response not found or failed to update" });
        }

        for (const field of data.responseFields || []) {
            if (field.id) {
                const fieldData = new FormResponseField({ ...field, formResponseId: data.id });
                const updatedField = await this.formResponseFieldService.updateFormResponseField(fieldData.updateFormResponseField);

                if (!updatedField) {
                    return res.status(500).json({ message: "Failed to update form response field" });
                }
            } else {
                const newFieldData = new FormResponseField({ ...field, responseId: data.id });
                const newField = await this.formResponseFieldService.createFormResponseField(newFieldData.createFormResponseField);

                if (!newField) {
                    return res.status(500).json({ message: "Failed to create new form response field" });
                }
            }
        }

        return res.status(200).json({
            message: "Form response updated successfully",
            status: "ok",
            data: updatedResponse
        });
    });

    getSingleFormResponse = expressAsyncHandler(async (req, res) => {
        const response = await this.formResponseService.getSingleFormResponse({ id: req.params.id });

        if (!response) {
            return res.status(404).json({ message: "Form response not found" });
        }

        return res.status(200).json({
            message: "Form response fetched successfully",
            status: "ok",
            data: response
        });
    });

    getFormResponses = expressAsyncHandler(async (req, res) => {
        const responses = await this.formResponseService.getFormResponses(req.params.formId);

        if (!responses) {
            return res.status(404).json({ message: "No form responses found" });
        }

        return res.status(200).json({
            message: "Form responses fetched successfully",
            status: "ok",
            data: responses
        });
    });

    deleteFormResponse = expressAsyncHandler(async (req, res) => {
        const response = await this.formResponseService.updateFormResponse({
            id: req.params.id,
            isDeleted: req.params.deleted === "true"
        });

        if (!response) {
            return res.status(500).json({ message: "Failed to delete form response" });
        }

        return res.status(200).json({
            message: "Form response deleted successfully",
            status: "ok",
            data: response
        });
    });
}

export default FormResponseController;
