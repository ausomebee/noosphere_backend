import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientAuthorizationDto {
    static createClientAuthorizationDto = (req, res, next) => {
        const schema = Joi.object({
            tenantClientId: Joi.string().uuid().required(),
            title: Joi.string().min(2).max(200).required(),
            authorizationNumber: Joi.string().min(2).max(150).required(),
            startDate: Joi.string().required(),
            endDate: Joi.string().required(),
            payer: Joi.string().min(2).max(150).required(),
            insuranceType: Joi.string().min(2).max(100).required(),
            serviceCodes: Joi.array().items(Joi.any()).required() // JSON field
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateClientAuthorizationDto = (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().min(2).max(200).optional(),
            authorizationNumber: Joi.string().min(2).max(150).optional(),
            startDate: Joi.string().optional(),
            endDate: Joi.string().optional(),
            payer: Joi.string().min(2).max(150).optional(),
            insuranceType: Joi.string().min(2).max(100).optional(),
            serviceCodes: Joi.array().items(Joi.any()).optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientAuthorizationDto;
