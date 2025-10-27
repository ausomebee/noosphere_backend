import prismaService from "../../../../config/prisma.js";
import FormResponseFieldService from "../../application/formResponseFieldService.js";
import FormResponseFieldsRepository from "../../infrastructure/formResponseFieldsRepository.js";

class FormResponseFieldsController {
    constructor() {
        this.prisma = prismaService.getClient();
        const formResponseFieldRepository = new FormResponseFieldsRepository(this.prisma.formResponseFields);
        this.formResponseFieldService = new FormResponseFieldService({ formResponseFieldRepository });
    }

    async createFormResponseField(req, res) {
        try {
            const data = req.body;

            const formResponseField = await this.formResponseFieldService.createFormResponseField(data);

            return res.status(201).json({
                message: "Form response field created successfully",
                data: formResponseField,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to create form response field",
            });
        }
    }

    async updateFormResponseField(req, res) {
        try {
            const data = {
                id: req.params.id,
                ...req.body,
            };

            const updatedField = await this.formResponseFieldService.updateFormResponseField(data);

            return res.status(200).json({
                message: "Form response field updated successfully",
                data: updatedField,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to update form response field",
            });
        }
    }

    async getSingleFormResponseField(req, res) {
        try {
            const id = req.params.id;

            const field = await this.formResponseFieldService.getSingleFormResponseField({ id });

            return res.status(200).json({
                message: "Form response field fetched successfully",
                data: field,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Form response field not found",
            });
        }
    }

    async getFormResponseFields(req, res) {
        try {
            const responseId = req.params.responseId;

            const fields = await this.formResponseFieldService.getFormResponseFields(responseId);

            return res.status(200).json({
                message: "Form response fields fetched successfully",
                data: fields,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Form response fields not found",
            });
        }
    }
}

export default FormResponseFieldsController;
