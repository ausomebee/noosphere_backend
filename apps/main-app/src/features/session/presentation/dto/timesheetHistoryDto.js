import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TimesheetHistoryDto {
    static createTimesheetHistoryDto = (req, res, next) => {
        const schema = Joi.object({
            sessionId: Joi.string().uuid().required(),
            action: Joi.string().required(),
            details: Joi.string().optional(),
            createdBy: Joi.string().uuid().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTimesheetHistoryDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            sessionId: Joi.string().uuid().optional(),
            action: Joi.string().optional(),
            details: Joi.string().optional(),
            createdBy: Joi.string().uuid().optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default TimesheetHistoryDto;
