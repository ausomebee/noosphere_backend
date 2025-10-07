class PayerServiceCodes {
    constructor({
        id,
        payerId,
        serviceCodeId,
        unitCurrency,
        ratePerUnit,
        roundingRuleId,
        modifiers,
        billable
    }) {
        this.id = id;
        this.payerId = payerId;
        this.serviceCodeId = serviceCodeId;
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
            unitCurrency: this.unitCurrency,
            ratePerUnit: this.ratePerUnit,
            modifiers: this.modifiers,
            billable: this.billable
        };
    }

    get updatePayerServiceCode() {
        return {
            id: this.id,
            payerId: this.payerId,
            serviceCodeId: this.serviceCodeId,
            roundingRuleId: this.roundingRuleId,
            unitCurrency: this.unitCurrency,
            ratePerUnit: this.ratePerUnit,
            modifiers: this.modifiers,
            billable: this.billable
        };
    }
}

export default PayerServiceCodes;
