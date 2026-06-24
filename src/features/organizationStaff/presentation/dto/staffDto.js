import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class StaffDto {
    static createTenantStaffDto = (req, res, next) => {
        const schema = Joi.object({
            fullName: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            roleId: Joi.string().uuid().required(),
            tenantId: Joi.string().uuid().required(),
            dob: Joi.string().optional(),
            gender: Joi.string().optional(),
            npi: Joi.string().optional(),
            address: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            zip: Joi.string().optional(),
            country: Joi.string().optional(),
            phoneNumber: Joi.string().min(1).required(),
            documents: Joi.array().items(
                Joi.object({
                    documentsUrl: Joi.object().required(),
                    tenantStaffId: Joi.string().uuid().optional()
                })
            ).required(),
            licenses: Joi.array().items(
                Joi.object({
                    licenseName: Joi.string().min(1).required(),
                    licenseNumber: Joi.string().min(1).required(),
                    issueState: Joi.string().min(1).required(),
                    expiryDate: Joi.date().required(),
                    tenantStaffId: Joi.string().uuid().optional()
                })
            ).optional(),
            payroll: Joi.object({
                paymentSchedule: Joi.string().min(1).required(),
                ratePerHour: Joi.string().min(1).required(),
                minimumHours: Joi.string().optional(),
                otherPays: Joi.array().optional(),
                deductions: Joi.array().optional()
            }).required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTenantStaffDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            fullName: Joi.string().min(1).optional(),
            email: Joi.string().email().optional(),
            roleId: Joi.string().uuid().optional(),
            dob: Joi.string().optional(),
            gender: Joi.string().optional(),
            npi: Joi.string().optional(),
            address: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            zip: Joi.string().optional(),
            country: Joi.string().optional(),
            phoneNumber: Joi.string().min(1).optional(),
            password: Joi.string().optional(),
            documents: Joi.array().items(
                Joi.object({
                    id: Joi.string().uuid().optional(),
                    documentsUrl: Joi.object().required(),
                    tenantStaffId: Joi.string().uuid().optional(),
                    isDeleted: Joi.boolean().optional()
                })
            ).optional(),
            licenses: Joi.array().items(
                Joi.object({
                    id: Joi.string().uuid().optional(),
                    licenseName: Joi.string().min(1).required(),
                    licenseNumber: Joi.string().min(1).required(),
                    issueState: Joi.string().min(1).required(),
                    expiryDate: Joi.date().required(),
                    tenantStaffId: Joi.string().uuid().optional(),
                    isDeleted: Joi.boolean().optional()
                })
            ).optional(),
            payroll: Joi.object({
                id: Joi.string().uuid().optional(),
                paymentSchedule: Joi.string().min(1).required(),
                ratePerHour: Joi.string().min(1).required(),
                tenantStaffId: Joi.string().uuid().optional(),
                minimumHours: Joi.string().optional(),
                otherPays: Joi.array().optional(),
                deductions: Joi.array().optional()
            }).optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTenantStaffOnlyDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            fullName: Joi.string().min(1).optional(),
            email: Joi.string().email().optional(),
            roleId: Joi.string().uuid().optional(),
            dob: Joi.string().optional(),
            gender: Joi.string().optional(),
            npi: Joi.string().optional(),
            address: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            zip: Joi.string().optional(),
            country: Joi.string().optional(),
            phoneNumber: Joi.string().min(1).optional(),
            password: Joi.string().optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default StaffDto;
