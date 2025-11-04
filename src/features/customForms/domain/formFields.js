class FormField {
    constructor({ 
        id, 
        formId, 
        fieldType, 
        label, 
        placeholder, 
        options, 
        isRequired, 
        order 
    }) {
        this.id = id;
        this.formId = formId;
        this.fieldType = fieldType;
        this.label = label;
        this.placeholder = placeholder;
        this.options = options;
        this.isRequired = isRequired;
        this.order = order;
    }

    get createFormField() {
        return {
            formId: this.formId,
            fieldType: this.fieldType,
            label: this.label,
            placeholder: this.placeholder,
            options: this.options,
            isRequired: this.isRequired,
            order: this.order
        };
    }

    get updateFormField() {
        return {
            id: this.id,
            formId: this.formId,
            fieldType: this.fieldType,
            label: this.label,
            placeholder: this.placeholder,
            options: this.options,
            isRequired: this.isRequired,
            order: this.order
        };
    }
}

export default FormField;
