import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayrollCycleStaffDto {
    static createPayrollCycleStaffDto = (req, res, next) => {
        const schema = Joi.object({
            payrollCycleId: Joi.string().uuid().required(),
            staffId: Joi.string().uuid().required(),
            paymentSchedule: Joi.string().valid('Hourly', 'Weekly', 'Monthly').required(),
            ratePerHour: Joi.number().positive().required(),
            minimumHours: Joi.number().positive().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayrollCycleStaffDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            payrollCycleId: Joi.string().uuid(),
            staffId: Joi.string().uuid(),
            paymentSchedule: Joi.string().valid('Hourly', 'Weekly', 'Monthly').required(),
            ratePerHour: Joi.number().positive().required(),
            minimumHours: Joi.number().positive().required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayrollCycleStaffDto;
