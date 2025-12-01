import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientFormDto {
    static createClientFormDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string().uuid().required(),
            formId: Joi.string().uuid().required(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientFormDto;
