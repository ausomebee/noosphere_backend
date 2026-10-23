import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class InsuranceTypeDto {
    static createInsuranceTypeDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1).required(),
            description: Joi.string().min(1).optional(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateInsuranceTypeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1),
            description: Joi.string().min(1),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default InsuranceTypeDto;
