import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class SubscriptionDto {
    static createSubscriptionDto = (req, res, next) => {
        const schema = Joi.object({
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            status: Joi.string().valid("ACTIVE", "PAUSED", "PENDING", "CANCELLED").trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            planId: Joi.string().uuid().required().messages({
                "string.empty": "plan ID is required",
                "string.guid": "plan ID must be a valid UUID",
            }),
            transactionId: Joi.string().uuid().required().messages({
                "string.empty": "transaction ID is required",
                "string.guid": "transaction ID must be a valid UUID",
            }),
            paymentId: Joi.number().required(),
            billingCycle: Joi.string().trim().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkPlanIdDto = (req, res, next) => {
        const schema = Joi.object({
            planId: Joi.string().uuid().required().messages({
                "string.empty": "Plan ID is required",
                "string.guid": "Plan ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkStatusDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("ACTIVE", "PAUSED", "PENDING", "CANCELLED", "all"),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    // static updateStatusDto = (req, res, next) => {
    //     const schema = Joi.object({
    //         status: Joi.string().valid("ACTIVE", "PAUSED", "PENDING", "CANCELLED").required(),
    //         id: Joi.string().uuid().required().messages({
    //             "string.empty": "ID is required",
    //             "string.guid": "ID must be a valid UUID"
    //         }),
    //         comment: Joi.string().required(),
    //         reason: Joi.string().required(),
    //         pauseSchedule: Joi.date().optional(),
    //         resumeShedule: Joi.date().optional(),
    //         autoRenew: Joi.boolean().optional()
    //     });

    //     Validator.validateRequest(req, next, schema);
    // };

    static cancelNowDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("CANCELLED").required().default("CANCELLED"),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required(),
            autoRenew: Joi.boolean().required().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static cancelAtEndDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required(),
            autoRenew: Joi.boolean().required().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static resumeNowDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("ACTIVE").required().default("ACTIVE"),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static resumeLaterDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required(),
            resumeShedule: Joi.date().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static pauseNowDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("PAUSED").required().default("PAUSED"),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required(),
            autoRenew: Joi.boolean().required().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static pauseUntilDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("PAUSED").required().default("PAUSED"),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required(),
            resumeShedule: Joi.date().required(),
            autoRenew: Joi.boolean().required().default(false)
        });

        Validator.validateRequest(req, next, schema);
    };

    static pauseScheduleDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID"
            }),
            comment: Joi.string().required(),
            reason: Joi.string().required(),
            pauseSchedule: Joi.date().required(),
            autoRenew: Joi.boolean().required().default(true)
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default SubscriptionDto;