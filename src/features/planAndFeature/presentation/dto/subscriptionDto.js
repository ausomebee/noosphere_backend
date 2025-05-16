import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class SubscriptionDto {
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

export default SubscriptionDto;