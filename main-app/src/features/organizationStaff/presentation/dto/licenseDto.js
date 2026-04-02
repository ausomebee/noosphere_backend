import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class LicenseDto {
    static updateLicenseDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            licenseName: Joi.string().min(1).required(),
            licenseNumber: Joi.string().min(1).required(),
            tenantStaffId: Joi.string().uuid().required(),
            issueState: Joi.string().min(1).required(),
            expiryDate: Joi.date().required(),
            isDeleted: Joi.boolean().optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createLicenseDto = (req, res, next) => {
        const schema = Joi.object({
            licenseName: Joi.string().min(1).required(),
            licenseNumber: Joi.string().min(1).required(),
            tenantStaffId: Joi.string().uuid().required(),
            issueState: Joi.string().min(1).required(),
            expiryDate: Joi.date().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default LicenseDto;