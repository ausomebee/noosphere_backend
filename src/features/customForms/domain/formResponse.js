class FormResponse {
    constructor({ id, formId, tenantId, submittedBy, submittedAt, responseFields }) {
        this.id = id;
        this.formId = formId;
        this.tenantId = tenantId;
        this.submittedBy = submittedBy;
        this.submittedAt = submittedAt;
        this.responseFields = responseFields;
    }

    get createFormResponse() {
        return {
            formId: this.formId,
            tenantId: this.tenantId,
            submittedBy: this.submittedBy,
            submittedAt: this.submittedAt,
            responseFields: this.responseFields
        };
    }

    get updateFormResponse() {
        return {
            id: this.id,
            formId: this.formId,
            tenantId: this.tenantId,
            submittedBy: this.submittedBy,
            submittedAt: this.submittedAt
        };
    }
}

export default FormResponse;
