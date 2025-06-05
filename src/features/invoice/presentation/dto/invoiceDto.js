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
            status: Joi.string().valid("Paid", "Upcoming", "Due", "Overdue").required(),
            dueDate: Joi.date().required()
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

}

export default InvoiceDto;