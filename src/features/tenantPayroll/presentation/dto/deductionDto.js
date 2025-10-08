import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class DeductionDto {
    static createDeductionDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1).required(),
            type: Joi.string().min(1).required(),
            rate: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateDeductionDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1),
            type: Joi.string().min(1),
            rate: Joi.number(),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default DeductionDto;
