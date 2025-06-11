import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class BillingDto {
    static createBillingMetadataDto = (req, res, next) => {
        const schema = Joi.object({
            billingAddress: Joi.string().trim().required(),
            paymentMethod: Joi.string().trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static createTransactionDto = (req, res, next) => {
        const schema = Joi.object({
            billingMetadataId: Joi.string().uuid().required().messages({
                "string.empty": "billing Metadata ID is required",
                "string.guid": "billing Metadata ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static createPaymentDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("Failed", "Successful", "In Progress").trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            amount: Joi.number().required(),
            invoiceId: Joi.number().required()
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

    static checkIntIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkStatusDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("Successful", "Failed", "In Progress", "all"),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

}

export default BillingDto;