import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayerDto {
    static createPayerDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            payerName: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(7).max(20).required(),
            insuranceTypeId: Joi.string().uuid().required(),
            tplCode: Joi.string().max(50).required(),
            carrierPayerId: Joi.string().max(100).required(),
            address: Joi.string().min(3).max(200).required(),
            city: Joi.string().min(2).max(100).required(),
            state: Joi.string().min(2).max(100).required(),
            zip: Joi.string().min(3).max(20).required(),
            country: Joi.string().min(2).max(100).required(),
            serviceCodes: Joi.array()
                .items(
                    Joi.object({
                        serviceCodeId: Joi.string().uuid().optional(),
                        code: Joi.string().required(),
                        description: Joi.string().required(),
                        unitCurrency: Joi.string().length(3).required(),
                        ratePerUnit: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(),
                        roundingRuleId: Joi.string().uuid().required(),
                        modifiers: Joi.object().unknown(true).required(),
                        billable: Joi.boolean().required()
                    })
                )
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayerDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "any.required": "Payer ID is required for update",
                "string.guid": "Payer ID must be a valid UUID"
            }),

            tenantId: Joi.string().uuid().required(),
            payerName: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(5).max(20).required(),
            insuranceTypeId: Joi.string().uuid().required(),
            tplCode: Joi.string().max(50).required(),
            carrierPayerId: Joi.string().max(50).required(),
            address: Joi.string().max(200).required(),
            city: Joi.string().max(100).required(),
            state: Joi.string().max(100).required(),
            zip: Joi.string().max(20).allow(null, ""),
            country: Joi.string().max(100).required(),
            isActive: Joi.boolean().default(true),
            isDeleted: Joi.boolean().default(false),

            serviceCodes: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().optional(), 
                        serviceCodeId: Joi.alternatives().try(
                            Joi.string().uuid(),
                            Joi.string().pattern(/^[0-9A-Za-z]+$/) 
                        ).optional(),

                        code: Joi.string().max(50).required(),
                        description: Joi.string().max(500).required(),
                        unitCurrency: Joi.string().max(10).required(),
                        ratePerUnit: Joi.string().pattern(/^[0-9]+$/).required(),
                        roundingRuleId: Joi.string().uuid().required(),
                        modifiers: Joi.object().pattern(Joi.string(), Joi.string()).default({}),
                        billable: Joi.boolean().required(),
                    })
                )
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayerDto;
