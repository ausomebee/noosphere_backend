class TenantAdditionalSecurityQuestionsService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createQuestion(data) {
        const newRecord = await this.repository.create(data);
        if (!newRecord) throw new Error("Failed to create Security Question");
        return newRecord;
    }

    async updateQuestion(data) {
        const record = await this.repository.findOne({ id: data.id });
        if (!record) throw new Error("Security Question not found");

        const updated = await this.repository.update(data.id, {
            question: data.question || record.question
        });

        if (!updated) throw new Error("Failed to update Security Question");
        return updated;
    }

    async getQuestion(id) {
        const record = await this.repository.findOne({ id });
        if (!record) throw new Error("Security Question not found");
        return record;
    }

    async getQuestions(tenantId) {
        const records = await this.repository.findAll({ tenantId });
        return records ?? [];
    }
}

export default TenantAdditionalSecurityQuestionsService;
