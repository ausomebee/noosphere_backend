import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class NotificationDto {
    static createNotificationDto = (req, res, next) => {
        const schema = Joi.object({
            userId: Joi.string()
                .uuid()
                .required(),
            userType: Joi.string()
                .valid("ADMIN", "TENANT_STAFF", "CLIENT")
                .required(),
            type: Joi.string()
                .min(1)
                .required(),
            title: Joi.string()
                .min(1)
                .required(),
            content: Joi.string()
                .min(1)
                .required(),
            entityType: Joi.string()
                .valid("APPOINTMENT", "ISSUE", "SUBSCRIPTION", "INVOICE", "PAYMENT", "TENANT", "PLAN")
                .optional(),
            entityId: Joi.string()
                .optional(),
            metadata: Joi.object()
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateNotificationDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            title: Joi.string()
                .min(1)
                .optional(),
            content: Joi.string()
                .min(1)
                .optional(),
            isRead: Joi.boolean()
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default NotificationDto;
