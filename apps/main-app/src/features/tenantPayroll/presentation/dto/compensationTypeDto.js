import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class CompensationTypeDto {
    static createCompensationTypeDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1).required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateCompensationTypeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default CompensationTypeDto;
