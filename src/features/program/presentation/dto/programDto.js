import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ProgramDto {
    static createProgramDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            description: Joi.string().trim().min(1).max(5000).optional(),
            domainId: Joi.string().uuid().optional(),
            id: Joi.forbidden(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static createCustomProgramDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            description: Joi.string().trim().min(1).max(5000).required(),
            clientId: Joi.string().uuid().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateProgramDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).optional(),
            description: Joi.string().trim().min(1).max(5000).optional(),
            domainId: Joi.string().uuid().optional(),
            id: Joi.string().uuid().required(),
            createdAt: Joi.forbidden(),
            updatedAt: Joi.forbidden(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default ProgramDto;