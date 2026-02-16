import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayrollCycleDto {
    static createPayrollCycleDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1).required(),
            compensationType: Joi.string().uuid().required(),
            interval: Joi.number().required(),
            startDate: Joi.string().required(),
            autoRun: Joi.boolean().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayrollCycleDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1),
            compensationType: Joi.string().uuid(),
            interval: Joi.number(),
            startDate: Joi.string(),
            autoRun: Joi.boolean(),
            isDeleted: Joi.boolean(),
            isActive: Joi.boolean()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayrollCycleDto;
