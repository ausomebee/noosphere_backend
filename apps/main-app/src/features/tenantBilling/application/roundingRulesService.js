class RoundingRulesService {
    constructor({ roundingRulesRepository }) {
        this.roundingRulesRepository = roundingRulesRepository;
    }

    async createRoundingRule(data) {
        const newRule = await this.roundingRulesRepository.create(data);

        if (!newRule) {
            throw new Error("Failed to create Rounding Rule");
        }

        return newRule;
    }

    async updateRoundingRule(data) {
        const rule = await this.roundingRulesRepository.findOne({ id: data.id });

        if (!rule) {
            throw new Error("Rounding Rule not found");
        }

        return await this.roundingRulesRepository.update(data.id, {
            ...rule,
            ...data
        });
    }

    async getSingleRoundingRule(data) {
        const rule = await this.roundingRulesRepository.findOne({ id: data.id });

        if (!rule) {
            throw new Error("Rounding Rule not found");
        }

        return rule;
    }

    async getTenantRoundingRules(tenantId) {
        return await this.roundingRulesRepository.findAll({ tenantId });
    }
}

export default RoundingRulesService;
