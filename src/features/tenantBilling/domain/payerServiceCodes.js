class PayerServiceCodes {
    constructor({
        id,
        payerId,
        serviceCodeId,
        description,
        unitCurrency,
        ratePerUnit,
        roundingRuleId,
        modifiers,
        billable
    }) {
        this.id = id;
        this.payerId = payerId;
        this.serviceCodeId = serviceCodeId;
        this.code = code;
        this.description = description;
        this.unitCurrency = unitCurrency;
        this.ratePerUnit = ratePerUnit;
        this.roundingRuleId = roundingRuleId;
        this.modifiers = modifiers;
        this.billable = billable;
    }

    get createPayerServiceCode() {
        return {
            payerId: this.payerId,
            serviceCodeId: this.serviceCodeId,
            roundingRuleId: this.roundingRuleId,
            description: this.description,
            unitCurrency: this.unitCurrency,
            ratePerUnit: this.ratePerUnit,
            modifiers: this.modifiers,
            billable: this.billable
        };
    }

    get updatePayerServiceCode() {
        return {
            payerId: this.payerId,
            serviceCodeId: this.serviceCodeId,
            roundingRuleId: this.roundingRuleId,
            description: this.description,
            unitCurrency: this.unitCurrency,
            ratePerUnit: this.ratePerUnit,
            modifiers: this.modifiers,
            billable: this.billable
        };
    }
}

export default PayerServiceCodes;
