import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PayrollCycleDto {
    static createPayrollCycleDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1).required(),
            compensationType: Joi.string().required(),
            interval: Joi.number().required(),
            startDate: Joi.string().required(),
            autoRun: Joi.boolean().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static manuallyCreatePayrollCycleDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required(),

            startDate: Joi.date().required(),
            endDate: Joi.date().greater(Joi.ref("startDate")).required(),

            staffs: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().required()
                    })
                )
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updatePayrollCycleDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            name: Joi.string().min(1),
            compensationType: Joi.string(),
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
