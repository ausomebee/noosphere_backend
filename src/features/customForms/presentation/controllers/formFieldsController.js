import prismaService from "../../../../config/prisma.js";
import FormFieldService from "../../application/formFieldService.js";
import FormFieldsRepository from "../../infrastructure/formFieldsRepository.js";

class FormFieldsController {
    constructor() {
        this.prisma = prismaService.getClient();
        const formFieldRepository = new FormFieldsRepository(this.prisma.formFields);
        this.formFieldService = new FormFieldService({ formFieldRepository });
    }

    async createFormField(req, res) {
        try {
            const data = req.body;

            const formField = await this.formFieldService.createFormField(data);

            return res.status(201).json({
                message: "Form field created successfully",
                data: formField,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to create form field",
            });
        }
    }

    async updateFormField(req, res) {
        try {
            const data = {
                id: req.params.id,
                ...req.body,
            };

            const updatedField = await this.formFieldService.updateFormField(data);

            return res.status(200).json({
                message: "Form field updated successfully",
                data: updatedField,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || "Failed to update form field",
            });
        }
    }

    async getSingleFormField(req, res) {
        try {
            const id = req.params.id;

            const field = await this.formFieldService.getSingleFormField({ id });

            return res.status(200).json({
                message: "Form field fetched successfully",
                data: field,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Form field not found",
            });
        }
    }

    async getFormFields(req, res) {
        try {
            const formId = req.params.formId;

            const fields = await this.formFieldService.getFormFields(formId);

            return res.status(200).json({
                message: "Form fields fetched successfully",
                data: fields,
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message || "Form fields not found",
            });
        }
    }
}

export default FormFieldsController;
