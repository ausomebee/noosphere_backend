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

    static createSubscriptionDto = (req, res, next) => {
        const schema = Joi.object({
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            status: Joi.string().trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            planId: Joi.string().uuid().required().messages({
                "string.empty": "plan ID is required",
                "string.guid": "plan ID must be a valid UUID",
            }),
            transactionId: Joi.string().uuid().required().messages({
                "string.empty": "transaction ID is required",
                "string.guid": "transaction ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static createBillingPlanDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
            description: Joi.string().trim().required(),
            billingCycle: Joi.string().trim().required(),
            price: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createFeatureDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
            description: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createPaymentDto = (req, res, next) => {
        const schema = Joi.object({
            paymentLink: Joi.string().trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            })
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

export default BillingDto;