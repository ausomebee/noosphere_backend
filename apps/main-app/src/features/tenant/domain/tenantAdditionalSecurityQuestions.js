class TenantAdditionalSecurityQuestions {
    constructor({ id, tenantId, question }) {
        this.id = id;
        this.tenantId = tenantId;
        this.question = question;
    }

    get createQuestion() {
        return {
            tenantId: this.tenantId,
            question: this.question
        };
    }
}

export default TenantAdditionalSecurityQuestions;
