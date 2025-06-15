import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class BillingDto {
    static createBillingMetadataDto = (req, res, next) => {
        const schema = Joi.object({
            billingAddress: Joi.string().trim().required(),
            paymentMethod: Joi.string().trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static createTransactionDto = (req, res, next) => {
        const schema = Joi.object({
            billingMetadataId: Joi.string().uuid().optional().messages({
                "string.empty": "billing Metadata ID is required",
                "string.guid": "billing Metadata ID must be a valid UUID",
            }),
            status: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createPaymentDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("Failed", "Successful", "In Progress").trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            amount: Joi.number().required(),
            invoiceId: Joi.number().required(),
            paymentMethodId: Joi.string().uuid().required().messages({
                "string.empty": "Payment method ID is required",
                "string.guid": "Payment method ID must be a valid UUID"
            })
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

    static checkIntIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkStatusDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("Successful", "Failed", "In Progress", "all"),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static createPaymentMethodDto = (req, res, next) => {
        const schema = Joi.object({
            cardType: Joi.string().trim().required(),
            gatewayToken: Joi.string().trim().required(),
            lastFourDigits: Joi.string().trim().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static createPaymentAceesDto = (req, res, next) => {
        const schema = Joi.object({
            chargeOnDueDate: Joi.boolean().required(),
            chargeLastUsedFirst: Joi.boolean().required(),
            chargeAlternative: Joi.boolean().required(),
            retryBefore: Joi.boolean().required(),
            retryAfter: Joi.boolean().required(),
            notifyTenant: Joi.boolean().required(),
            notificationEmailHeader: Joi.string().required(),
            notificationEmailBody: Joi.string().required(),
            cancelAfter: Joi.number().integer().required(),
            manualCancel: Joi.boolean().required(),
            suspensionAction: Joi.string().required(),
            errorMessage: Joi.string().required(),
            emailAfterAttempts: Joi.number().integer().required(),
            warningMailHeader: Joi.string().required(),
            warningMailBody: Joi.string().required(),
            sendOnSubscriptionCancel: Joi.boolean().required(),
            cancelMailHeader: Joi.string().required(),
            cancelMailBody: Joi.string().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateChargeOnDueDateDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            chargeOnDueDate: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateChargeLastUsedFirstDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            chargeLastUsedFirst: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateChargeAlternativeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            chargeAlternative: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateRetryBeforeDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            retryBefore: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateRetryAfterDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            retryAfter: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateNotifyTenantDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            notifyTenant: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateNotificationEmailHeaderDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            notificationEmailHeader: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateNotificationEmailBodyDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            notificationEmailBody: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateCancelAfterDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            cancelAfter: Joi.number().integer().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateManualCancelDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            manualCancel: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateSuspensionActionDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            suspensionAction: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateErrorMessageDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            errorMessage: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateEmailAfterAttemptsDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            emailAfterAttempts: Joi.number().integer().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateWarningMailHeaderDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            warningMailHeader: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateWarningMailBodyDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            warningMailBody: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateSendOnSubscriptionCancelDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            sendOnSubscriptionCancel: Joi.boolean().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateCancelMailHeaderDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            cancelMailHeader: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

    static updateCancelMailBodyDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            cancelMailBody: Joi.string().required(),
        });
        Validator.validateRequest(req, next, schema);
    };

}

export default BillingDto;