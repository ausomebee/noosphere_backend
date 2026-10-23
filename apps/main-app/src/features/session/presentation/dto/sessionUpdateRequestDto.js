import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class SessionUpdateRequestDto {
    static createSessionUpdateRequestDto = (req, res, next) => {
        const schema = Joi.object({
            sessionId: Joi.string().uuid().required(),
            description: Joi.string().required(),
            requestedBy: Joi.string().uuid().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSessionUpdateRequestDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            sessionId: Joi.string().uuid().optional(),
            description: Joi.string().optional(),
            requestedBy: Joi.string().uuid().optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default SessionUpdateRequestDto;
