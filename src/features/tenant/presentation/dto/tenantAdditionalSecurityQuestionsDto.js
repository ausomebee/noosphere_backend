import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TenantAdditionalSecurityQuestionsDto {
    static createQuestionDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .uuid()
                .required(),
            question: Joi.string()
                .min(1)
                .required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateQuestionDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .required(), 
            question: Joi.string()
                .min(1)
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default TenantAdditionalSecurityQuestionsDto;
