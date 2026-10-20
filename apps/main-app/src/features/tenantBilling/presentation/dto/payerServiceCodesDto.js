import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayerServiceCodesDto {
    static createPayerServiceCodeDto = (req, res, next) => {
        const schema = Joi.array()
            .items(
                Joi.object({
                    tenantId: Joi.string().uuid().required(),
                    payerId: Joi.string().uuid().required(),
                    serviceCodeId: Joi.string().uuid().allow("").optional(),
                    code: Joi.string().required(),
                    description: Joi.string().required(),
                    unitCurrency: Joi.string().length(3).required(),
                    ratePerUnit: Joi.number().required(),
                    roundingRuleId: Joi.string().uuid().required(),
                    modifiers: Joi.array().items(Joi.string()).required(),
                    billable: Joi.boolean().required(),
                })
            )
            .min(1)
            .required();

        return Validator.validateRequest(req, next, schema);
    };

    static updatePayerServiceCodeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            payerId: Joi.string().uuid(),
            serviceCodeId: Joi.string().uuid(),
            code: Joi.string().min(1),
            description: Joi.string().min(1),
            unitCurrency: Joi.string().min(1),
            ratePerUnit: Joi.string().min(1),
            roundingRuleId: Joi.string().uuid(),
            modifiers: Joi.object(),
            billable: Joi.boolean(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayerServiceCodesDto;
