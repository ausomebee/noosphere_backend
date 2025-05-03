import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class AuthDto {
    static verifyDto = (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            token: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static authDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static secretMessageDto = (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            secret: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default AuthDto;