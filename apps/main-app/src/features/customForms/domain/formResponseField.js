class FormResponseField {
    constructor({ id, formResponseId, formFieldId, value }) {
        this.id = id;
        this.formResponseId = formResponseId;
        this.formFieldId = formFieldId;
        this.value = value;
    }

    get createFormResponseField() {
        return {
            formResponseId: this.formResponseId,
            formFieldId: this.formFieldId,
            value: this.value
        };
    }

    get updateFormResponseField() {
        return {
            id: this.id,
            value: this.value
        };
    }
}

export default FormResponseField;
