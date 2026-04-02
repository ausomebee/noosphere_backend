class PayrollCycleStaffDeduction {
    constructor({
        id,
        payrollCycleStaffId,
        name,
        type,
        rate,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.payrollCycleStaffId = payrollCycleStaffId;
        this.name = name;
        this.type = type;
        this.rate = rate;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createPayrollCycleStaffDeduction() {
        return {
            payrollCycleStaffId: this.payrollCycleStaffId,
            name: this.name,
            type: this.type,
            rate: this.rate,
        };
    }

    get updatePayrollCycleStaffDeduction() {
        return {
            id: this.id,
            payrollCycleStaffId: this.payrollCycleStaffId,
            name: this.name,
            type: this.type,
            rate: this.rate,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default PayrollCycleStaffDeduction;
