import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class SessionApprovalDto {
    static createSessionApprovalDto = (req, res, next) => {
        const schema = Joi.object({
            sessionId: Joi.string().uuid().required(),
            confirmDelivery: Joi.boolean().required(),
            rateService: Joi.number().integer().min(0).max(5).optional(),
            rateTherapist: Joi.number().integer().min(0).max(5).optional(),
            feedback: Joi.string().optional(),
            signature: Joi.string().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSessionApprovalDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            confirmDelivery: Joi.boolean().optional(),
            rateService: Joi.number().integer().min(0).max(5).optional(),
            rateTherapist: Joi.number().integer().min(0).max(5).optional(),
            feedback: Joi.string().optional(),
            signature: Joi.string().optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default SessionApprovalDto;
