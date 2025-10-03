import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayerDto {
    static createPayerDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            payerName: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
            insuranceTypeId: Joi.string().uuid().required(),
            tplCode: Joi.string().required(),
            carrierPayerId: Joi.string().required(),
            address: Joi.string().min(1).required(),
            city: Joi.string().min(1).required(),
            state: Joi.string().min(1).required(),
            zip: Joi.string().min(1).required(),
            country: Joi.string().min(1).required(),
            serviceCodes: Joi.object().required(),
            isDeleted: Joi.boolean().default(false),
            isActive: Joi.boolean().default(true),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayerDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            payerName: Joi.string().min(1),
            email: Joi.string().email(),
            phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
            insuranceTypeId: Joi.string().uuid(),
            tplCode: Joi.string(),
            carrierPayerId: Joi.string(),
            address: Joi.string().min(1),
            city: Joi.string().min(1),
            state: Joi.string().min(1),
            zip: Joi.string().min(1),
            country: Joi.string().min(1),
            serviceCodes: Joi.object(),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayerDto;
