import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import FormsRepository from "../../infrastructure/formRepository.js";
import FormFieldsRepository from "../../infrastructure/formFieldsRepository.js";
import FormService from "../../application/formService.js";
import FormFieldService from "../../application/formFieldService.js";
import Form from "../../domain/form.js";
import FormField from "../../domain/formFields.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import ClientNotificationEmitter from "../../../client/application/clientNotificationEmitter.js";
import SocketService from "../../../../config/socket.js";
import MailService from "../../../../utilities/nodemailer.js";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class FormController {
    constructor() {
        this.prisma = prismaService.getClient();

        const formRepository = new FormsRepository(this.prisma.forms);
        const formFieldRepository = new FormFieldsRepository(this.prisma.formFields);

        this.formService = new FormService({ formRepository });
        this.formFieldService = new FormFieldService({ formFieldRepository });
        this.notificationService = new NotificationService({ notificationRepository: new NotificationsRepository(this.prisma.notification) });
        this.clientNotificationEmitter = new ClientNotificationEmitter({
            prisma: this.prisma,
            notificationService: this.notificationService,
        });
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

        if (form.tenantClientId) {
            const clientTenant = await this.prisma.clientTenant.findUnique({ where: { id: form.tenantClientId }, include: { client: { select: { id: true, email: true } } } });
            if (clientTenant) {
                await this.clientNotificationEmitter.emit({
                    clientId: clientTenant.client.id,
                    tenantId: form.tenantId,
                    type: NotificationType.FORM_SHARED,
                    title: "Form Shared",
                    content: "Your provider has requested information from you. Please complete this form.",
                    entityType: NotificationEntityType.FORM,
                    entityId: form.id,
                    metadata: { tenantClientId: form.tenantClientId },
                });

                await this.notificationService.dispatch({
                    recipients: [{ userId: clientTenant.client.id, userType: "CLIENT" }],
                    type: NotificationType.FORM_CREATED,
                    title: "Form Requested",
                    content: "Your provider has requested information from you. Please complete this form.",
                    entityType: NotificationEntityType.FORM,
                    entityId: form.id,
                    metadata: { tenantId: form.tenantId, tenantClientId: form.tenantClientId },
                }, SocketService.emitToUser.bind(SocketService));
                await MailService.sendMail(clientTenant.client.email, "Form Requested", "Your provider has requested information from you. Please complete this form.");
            }
        }

        await auditLogger.log(req, {
            tenantId: form.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Custom Forms",
            action: `created form ${form.id}`,
            reason: "Custom form management",
            accessedBy: req.user?.name || null,
        });

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

        await auditLogger.log(req, {
            tenantId: updatedForm.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Custom Forms",
            action: `updated form ${updatedForm.id}`,
            reason: "Custom form management",
            accessedBy: req.user?.name || null,
        });

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

        const formFields = await this.formFieldService.getFormFields(form.id);

        return res.status(200).json({
            message: "Form fetched successfully",
            status: "ok",
            data: { ...form, fields: formFields }
        });
    });

    duplicateForm = expressAsyncHandler(async (req, res) => {
        const form = await this.formService.getSingleForm({ id: req.params.id });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const formFields = await this.formFieldService.getFormFields(form.id);
        const duplicateName = await this.formService.getAvailableDuplicateName({
            name: form.name,
            tenantId: form.tenantId
        });

        const formData = new Form({ ...form, name: duplicateName });
        const newForm = await this.formService.createForm(formData.createForm);

        for (const field of formFields || []) {
            const fieldData = new FormField({ ...field, formId: newForm.id });
            const formField = await this.formFieldService.createFormField(fieldData.createFormField);

            if (!formField) {
                return res.status(500).json({ message: "Failed to create form field" });
            }
        }

        await auditLogger.log(req, {
            tenantId: newForm.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Custom Forms",
            action: `duplicated form ${form.id} into ${newForm.id}`,
            reason: "Custom form management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Form duplicated successfully",
            status: "ok",
            data: newForm
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

    getTenantDrafts = expressAsyncHandler(async (req, res) => {
        const forms = await this.formService.getTenantDrafts(req.params.tenantId);

        if (!forms) {
            return res.status(404).json({ message: "No forms found" });
        }

        return res.status(200).json({
            message: "Drafts fetched successfully",
            status: "ok",
            data: forms
        });
    });

    getTenantTemplates = expressAsyncHandler(async (req, res) => {
        const forms = await this.formService.getTenantTemplates(req.params.tenantId);

        if (!forms) {
            return res.status(404).json({ message: "No forms found" });
        }

        return res.status(200).json({
            message: "Templates fetched successfully",
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

        await auditLogger.log(req, {
            tenantId: form.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Custom Forms",
            action: `${req.params.delete === "true" ? "deactivated" : "reactivated"} form ${form.id}`,
            reason: "Custom form management",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Form deactivated successfully",
            status: "ok",
            data: form
        });
    });
}

export default FormController;
