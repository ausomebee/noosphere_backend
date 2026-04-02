import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class LicenseDto {
    static createLicenseDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string()
                .required(),
            licenseName: Joi.string()
                .min(1)
                .required(),
            licenseNumber: Joi.string()
                .min(1)
                .required(),
            issueState: Joi.string()
                .min(1)
                .required(),
            expiryDate: Joi.date()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateLicenseDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string()
                .uuid()
                .optional(),
            tenantId: Joi.string()
                .required(),
            licenseName: Joi.string()
                .min(1)
                .required(),
            licenseNumber: Joi.string()
                .min(1)
                .required(),
            issueState: Joi.string()
                .min(1)
                .required(),
            expiryDate: Joi.date()
                .required(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default LicenseDto;