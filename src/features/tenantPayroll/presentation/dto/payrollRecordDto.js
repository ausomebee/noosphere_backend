import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayrollRecordDto {
    static createPayrollRecordDto = (req, res, next) => {
        const schema = Joi.object({
            payrollCycleId: Joi.string().uuid().required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
            noOfStaff: Joi.number().integer().min(1).required(),
            totalValue: Joi.number().precision(2).required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayrollRecordDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            payrollCycleId: Joi.string().uuid().optional(),
            from: Joi.date().optional(),
            to: Joi.date().optional(),
            noOfStaff: Joi.number().integer().min(1).optional(),
            totalValue: Joi.number().precision(2).optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default PayrollRecordDto;
