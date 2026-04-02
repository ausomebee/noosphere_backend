class RoundingRules {
    constructor({
        id,
        tenantId,
        ruleType,
        ruleName,
        description,
        standardUnit,
        roundingRule,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.ruleType = ruleType;
        this.ruleName = ruleName;
        this.description = description;
        this.standardUnit = standardUnit;
        this.roundingRule = roundingRule;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createRoundingRule() {
        return {
            tenantId: this.tenantId,
            ruleType: this.ruleType,
            ruleName: this.ruleName,
            description: this.description,
            standardUnit: this.standardUnit,
            roundingRule: this.roundingRule,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default RoundingRules;
