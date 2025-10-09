class PayrollRecord {
    constructor({ 
        id, 
        payrollCycleId, 
        from, 
        to, 
        noOfStaff, 
        totalValue 
    }) {
        this.id = id;
        this.payrollCycleId = payrollCycleId;
        this.from = from;
        this.to = to;
        this.noOfStaff = noOfStaff;
        this.totalValue = totalValue;
    }

    get createPayrollRecord() {
        return {
            payrollCycleId: this.payrollCycleId,
            from: this.from,
            to: this.to,
            noOfStaff: this.noOfStaff,
            totalValue: this.totalValue
        };
    }

    get updatePayrollRecord() {
        return {
            id: this.id,
            payrollCycleId: this.payrollCycleId,
            from: this.from,
            to: this.to,
            noOfStaff: this.noOfStaff,
            totalValue: this.totalValue
        };
    }
}

export default PayrollRecord;
