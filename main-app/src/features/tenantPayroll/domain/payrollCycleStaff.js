class PayrollCycleStaff {
    constructor({ id, payrollCycleId, staffId, paymentSchedule, ratePerHour, minimumHours }) {
        this.id = id;
        this.payrollCycleId = payrollCycleId;
        this.staffId = staffId;
        this.paymentSchedule = paymentSchedule;
        this.ratePerHour = ratePerHour;
        this.minimumHours = minimumHours;
    }

    get createPayrollCycleStaff() {
        return {
            payrollCycleId: this.payrollCycleId,
            staffId: this.staffId,
            paymentSchedule: this.paymentSchedule,
            ratePerHour: this.ratePerHour,
            minimumHours: this.minimumHours
        };
    }

    get updatePayrollCycleStaff() {
        return {
            id: this.id,
            payrollCycleId: this.payrollCycleId,
            staffId: this.staffId,
            paymentSchedule: this.paymentSchedule,
            ratePerHour: this.ratePerHour,
            minimumHours: this.minimumHours
        };
    }
}

export default PayrollCycleStaff;
