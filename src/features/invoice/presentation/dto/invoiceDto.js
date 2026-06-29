import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class InvoiceDto {
    static createInvoiceDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            planId: Joi.string().uuid().required().messages({
                "string.empty": "Plan ID is required",
                "string.guid": "Plan ID must be a valid UUID"
            }),
            quantity: Joi.number().required(),
            status: Joi.string().valid("Paid", "Upcoming", "Due", "Overdue").required(),
            billingFrequency: Joi.string().valid("Monthly", "Yearly").required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkStatusDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("Paid", "Upcoming", "Due", "Overdue", "all"),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkDurationDto = (req, res, next) => {
        const schema = Joi.object({
            from: Joi.alternatives().try(Joi.date(), Joi.string().valid("all")),
            to: Joi.alternatives().try(Joi.date(), Joi.string().valid("all"))
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static createInvoiceManagementDto = (req, res, next) => {
        const schema = Joi.object({
            onPlanPurchase: Joi.boolean().required(),
            isDaysBeforeDueDate: Joi.boolean().required(),
            daysBeforeDueDate: Joi.number().integer().required(),
            upcomingInvoiceHeader: Joi.string().required(),
            upcomingInvoiceBody: Joi.string().required(),
            onDueDate: Joi.boolean().required(),
            dueInvoiceHeader: Joi.string().required(),
            dueInvoiceBody: Joi.string().required(),
            markOverDue: Joi.number().integer().required(),
            unpaidReminderTimesBefore: Joi.number().integer().required(),
            attachInvoiceToReminder: Joi.boolean().required(),
            reminderEmail: Joi.array().items(
                Joi.object({
                    header: Joi.string().required(),
                    body: Joi.string().required(),
                    sendOn: Joi.number().required()
                })
            ).required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateOnPlanPurchaseDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            onPlanPurchase: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateDaysBeforeDueDateDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            daysBeforeDueDate: Joi.number().integer().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateIsDaysBeforeDueDateDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            isDaysBeforeDueDate: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateUpcomingInvoiceDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            upcomingInvoiceHeader: Joi.string().required(),
            upcomingInvoiceBody: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateOnDueDateDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            onDueDate: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateDueInvoiceDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            dueInvoiceHeader: Joi.string().required(),
            dueInvoiceBody: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateMarkOverDueDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            markOverDue: Joi.number().integer().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateUnpaidReminderTimesBeforeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            unpaidReminderTimesBefore: Joi.number().integer().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateAttachInvoiceToReminderDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            attachInvoiceToReminder: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateReminderEmailDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            reminderEmail: Joi.array().items(
                Joi.object({
                    header: Joi.string().required(),
                    body: Joi.string().required(),
                    sendOn: Joi.number().required(),
                })
            ).required(),
        });
        Validator.validateRequest(req, next, schema);
    };

}

export default InvoiceDto;
