import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class SessionDto {
    static createSessionDto = (req, res, next) => {
        const schema = Joi.object({
            note: Joi.string().required(),
            appointmentId: Joi.string().uuid().required(),
            supervisorApprovalStatus: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
            clientApprovalStatus: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
            createdBy: Joi.string().uuid().optional(),
            startTime: Joi.date().required(),
            endTime: Joi.date().required(),
            travelStartTime: Joi.date().optional(),
            travelEndTime: Joi.date().optional(),
            sessionDatas: Joi.array().items(Joi.object({
                targetId: Joi.string().uuid().required(),
                data: Joi.object().required()
            })).optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSessionDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            note: Joi.string().optional(),
            appointmentId: Joi.string().uuid().optional(),
            supervisorApprovalStatus: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
            clientApprovalStatus: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
            supervisorId: Joi.string().uuid().optional(),
            startTime: Joi.date().optional(),
            endTime: Joi.date().optional(),
            travelStartTime: Joi.date().optional(),
            travelEndTime: Joi.date().optional(),
            sessionDatas: Joi.array().items(Joi.object({
                id: Joi.string().uuid().optional(),
                targetId: Joi.string().uuid().optional(),
                data: Joi.object().optional()
            })).optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default SessionDto;
