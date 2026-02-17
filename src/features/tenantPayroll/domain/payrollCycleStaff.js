class PayrollCycleStaff {
    constructor({ id, payrollCycleId, staffId }) {
        this.id = id;
        this.payrollCycleId = payrollCycleId;
        this.staffId = staffId;
    }

    get createPayrollCycleStaff() {
        return {
            payrollCycleId: this.payrollCycleId,
            staffId: this.staffId
        };
    }

    get updatePayrollCycleStaff() {
        return {
            id: this.id,
            payrollCycleId: this.payrollCycleId,
            staffId: this.staffId
        };
    }
}

export default PayrollCycleStaff;
