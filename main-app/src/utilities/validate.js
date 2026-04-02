class Validator {
    static validateRequest(req, next, schema, data = req.body) {
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        const { error, value } = schema.validate(data, options);

        if (error) {
            return next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
        }

        if (data === req.body) {
            req.body = value;
        } else if (data === req.params) {
            req.params = value;
        } else if (data === req.query) {
            req.query = value;
        }

        next();
    }
}

export default Validator;