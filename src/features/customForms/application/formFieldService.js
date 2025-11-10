class FormFieldService {
    constructor({ formFieldRepository }) {
        this.formFieldRepository = formFieldRepository;
    }

    async createFormField(data) {
        console.log(data)
        const fieldExists = await this.formFieldRepository.findFirstDynamic({
            where: { label: data.label, formId: data.formId },
            select: { label: true }
        });

        if (fieldExists) {
            throw new Error("This form field already exists for this form.");
        }

        const newField = await this.formFieldRepository.create(data);

        if (!newField) {
            throw new Error("Failed to create Form Field");
        }

        return newField;
    }

    async updateFormField(data) {
        const field = await this.formFieldRepository.findOne({ id: data.id });

        if (!field) {
            throw new Error("Form Field not found");
        }

        const update = await this.formFieldRepository.update(data.id, {
            fieldType: data.fieldType || field.fieldType,
            label: data.label || field.label,
            placeholder: data.placeholder || field.placeholder,
            options: data.options || field.options,
            isRequired: data.isRequired ?? field.isRequired,
            order: data.order ?? field.order,
        });

        if (!update) {
            throw new Error("Failed to update Form Field");
        }

        return update;
    }

    async getSingleFormField(data) {
        const field = await this.formFieldRepository.findOne({ id: data.id });

        if (!field) {
            throw new Error("Form Field not found");
        }

        return field;
    }

    async getFormFields(formId) {
        const fields = await this.formFieldRepository.findAll({ formId });

        if (!fields) {
            throw new Error("Form Fields not found");
        }

        return fields;
    }
}

export default FormFieldService;
