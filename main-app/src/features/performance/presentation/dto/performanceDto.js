import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PerformanceDto {
    static checkTimeDto = (req, res, next) => {
        const schema = Joi.object({
            startTime: Joi.date()
                .iso()
                .required()
                .label('startTime')
                .messages({
                    'any.required': '"startTime" is required',
                    'date.format': '"startTime" must be a valid ISO date'
                }),
            endTime: Joi.date()
                .iso()
                .greater(Joi.ref('startTime'))
                .required()
                .label('endTime')
                .messages({
                    'any.required': '"endTime" is required',
                    'date.greater': '"endTime" must be later than "startTime"',
                    'date.format': '"endTime" must be a valid ISO date'
                })
        });

        Validator.validateRequest(req, next, schema, req.query);
    };

}

export default PerformanceDto;