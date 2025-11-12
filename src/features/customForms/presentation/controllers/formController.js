import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import FormsRepository from "../../infrastructure/formRepository.js";
import FormFieldsRepository from "../../infrastructure/formFieldsRepository.js";
import FormService from "../../application/formService.js";
import FormFieldService from "../../application/formFieldService.js";
import Form from "../../domain/form.js";
import FormField from "../../domain/formFields.js";

class FormController {
    constructor() {
        this.prisma = prismaService.getClient();

        const formRepository = new FormsRepository(this.prisma.forms);
        const formFieldRepository = new FormFieldsRepository(this.prisma.formFields);

        this.formService = new FormService({ formRepository });
        this.formFieldService = new FormFieldService({ formFieldRepository });
    }

    createForm = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const formData = new Form(data);
        const form = await this.formService.createForm(formData.createForm);

        if (!form) {
            return res.status(500).json({ message: "Failed to create form" });
        }

        for (const field of data.formFields || []) {
            const fieldData = new FormField({ ...field, formId: form.id });
            const formField = await this.formFieldService.createFormField(fieldData.createFormField);

            if (!formField) {
                return res.status(500).json({ message: "Failed to create form field" });
            }
        }

        return res.status(201).json({
            message: "Form created successfully",
            status: "ok",
            data: form
        });
    });

    updateForm = expressAsyncHandler(async (req, res) => {
        const data = req.body;

        const formData = new Form(data);
        const updatedForm = await this.formService.updateForm(formData.updateForm);

        if (!updatedForm) {
            return res.status(404).json({ message: "Form not found or failed to update" });
        }

        for (const field of data.formFields || []) {
            if (field.id) {
                const fieldData = new FormField({ ...field, formId: data.id });
                const updatedField = await this.formFieldService.updateFormField(fieldData.updateFormField);

                if (!updatedField) {
                    return res.status(500).json({ message: "Failed to update form field" });
                }
            } else {
                const newFieldData = new FormField({ ...field, formId: data.id });
                const newField = await this.formFieldService.createFormField(newFieldData.createFormField);

                if (!newField) {
                    return res.status(500).json({ message: "Failed to create new form field" });
                }
            }
        }

        return res.status(200).json({
            message: "Form updated successfully",
            status: "ok",
            data: updatedForm
        });
    });

    getSingleForm = expressAsyncHandler(async (req, res) => {
        const form = await this.formService.getSingleForm({ id: req.params.id });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const formFields = await this.formFieldService.getFormFields({ formId: form.id });

        return res.status(200).json({
            message: "Form fetched successfully",
            status: "ok",
            data: { form, formFields }
        });
    });

    getTenantForms = expressAsyncHandler(async (req, res) => {
        const forms = await this.formService.getTenantForms(req.params.tenantId);

        if (!forms) {
            return res.status(404).json({ message: "No forms found" });
        }

        return res.status(200).json({
            message: "Forms fetched successfully",
            status: "ok",
            data: forms
        });
    });

    deactivateForm = expressAsyncHandler(async (req, res) => {
        const form = await this.formService.updateForm({
            id: req.params.id,
            isDeleted: req.params.delete === "true"
        });

        if (!form) {
            return res.status(500).json({ message: "Failed to deactivate form" });
        }

        return res.status(200).json({
            message: "Form deactivated successfully",
            status: "ok",
            data: form
        });
    });
}

export default FormController;
