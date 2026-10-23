import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class SessionDataDto {
    static createSessionDataDto = (req, res, next) => {
        const schema = Joi.object({
            sessionId: Joi.string().uuid().required(),
            targetId: Joi.string().uuid().required(),
            data: Joi.object().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSessionDataDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            sessionId: Joi.string().uuid().optional(),
            targetId: Joi.string().uuid().optional(),
            data: Joi.object().optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default SessionDataDto;
