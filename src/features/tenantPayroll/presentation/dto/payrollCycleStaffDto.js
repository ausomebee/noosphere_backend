import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayrollCycleStaffDto {
    static createPayrollCycleStaffDto = (req, res, next) => {
        const schema = Joi.object({
            payrollCycleId: Joi.string().uuid().required(),
            staffId: Joi.string().uuid().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayrollCycleStaffDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            payrollCycleId: Joi.string().uuid(),
            staffId: Joi.string().uuid()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayrollCycleStaffDto;
