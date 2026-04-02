class FormField {
    constructor({
        id,
        formId,
        fieldType,
        label,
        placeholder,
        options,
        isRequired,
        order,
        fileUpload,
        starRating,
        signature,
    }) {
        this.id = id;
        this.formId = formId;
        this.fieldType = fieldType;
        this.label = label;
        this.placeholder = placeholder;
        this.options = options;
        this.isRequired = isRequired;
        this.order = order;
        this.fileUpload = fileUpload;
        this.starRating = starRating;
        this.signature = signature;
    }

    get createFormField() {
        return {
            formId: this.formId,
            fieldType: this.fieldType,
            label: this.label,
            placeholder: this.placeholder,
            options: this.options,
            fileUpload: this.fileUpload,
            starRating: this.starRating,
            signature: this.signature,
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
            fileUpload: this.fileUpload,
            starRating: this.starRating,
            signature: this.signature,
            order: this.order
        };
    }
}

export default FormField;
