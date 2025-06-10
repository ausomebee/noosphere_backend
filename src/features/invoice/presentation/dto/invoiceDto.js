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
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkStatusDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("Paid", "Upcoming", "Due", "Overdue").optional(),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

}

export default InvoiceDto;