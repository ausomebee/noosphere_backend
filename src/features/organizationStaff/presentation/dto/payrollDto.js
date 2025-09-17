import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayrollDto {
    static updatePayrollDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            paymentSchedule: Joi.string().min(1).required(),
            ratePerHour: Joi.string().min(1).required(),
            tenantStaffId: Joi.string().uuid().required(),
            minimumHours: Joi.string().optional(),
            otherPays: Joi.object().optional(),
            deductions: Joi.object().optional()
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default PayrollDto;