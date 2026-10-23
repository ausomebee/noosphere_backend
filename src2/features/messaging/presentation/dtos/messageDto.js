import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class MessageDto {
    static createMessageDto = (req, res, next) => {
        const schema = Joi.object({
            senderId: Joi.string()
                .uuid()
                .required(),
            senderType: Joi.string()
                .valid("ADMIN", "TENANT_STAFF", "CLIENT")
                .required(),
            receiverId: Joi.string()
                .uuid()
                .required(),
            receiverType: Joi.string()
                .valid("ADMIN", "TENANT_STAFF", "CLIENT")
                .required(),
            content: Joi.string()
                .min(1)
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateMessageDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(),
            content: Joi.string()
                .min(1)
                .optional(),
            isRead: Joi.boolean()
                .optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default MessageDto;