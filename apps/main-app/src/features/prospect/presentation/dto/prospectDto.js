import Joi from 'joi';
import Validator from '../../../../utilities/validate.js';

class ProspectDto {
    static sendEmailDto = (req, res, next) => {
        const schema = Joi.object({
            to: Joi.string().trim().email().required().messages({
                'string.empty': 'Recipient email is required',
                'string.email': 'Recipient email must be valid',
                'any.required': 'Recipient email is required',
            }),
            subject: Joi.string().trim().max(200).required().messages({
                'string.empty': 'Subject is required',
                'string.max': 'Subject must not exceed 200 characters',
                'any.required': 'Subject is required',
            }),
            body: Joi.string().trim().max(10000).required().messages({
                'string.empty': 'Email body is required',
                'string.max': 'Email body must not exceed 10,000 characters',
                'any.required': 'Email body is required',
            }),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ProspectDto;
