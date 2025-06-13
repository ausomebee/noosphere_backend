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
            daysBeforeDueDate: Joi.number().integer().required(),
            upcomingInvoiceHeader: Joi.string().required(),
            upcomingInvoiceBody: Joi.string().required(),
            onDueDate: Joi.boolean().required(),
            dueInvoiceHeader: Joi.string().required(),
            dueInvoiceBody: Joi.string().required(),
            markOverDue: Joi.number().integer().required(),
            unpaidReminderTimesBefore: Joi.number().integer().required(),
            attachInvoiceToReminder: Joi.boolean().required(),
            reminderEmail: Joi.object().required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default InvoiceDto;