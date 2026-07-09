class TenantStaffPayroll {
    constructor({
        id,
        paymentSchedule,
        ratePerHour,
        tenantStaffId,
        minimumHours,
        otherPays,
        deductions,
        tenantStaff,
        isDeleted
    }) {
        this.id = id;
        this.paymentSchedule = paymentSchedule;
        this.ratePerHour = ratePerHour;
        this.tenantStaffId = tenantStaffId;
        this.minimumHours = minimumHours;
        this.otherPays = otherPays;
        this.deductions = deductions;
        this.tenantStaff = tenantStaff;
        this.isDeleted = isDeleted;
    }

    get createTenantStaffPayroll() {
        return {
            paymentSchedule: this.paymentSchedule,
            ratePerHour: this.ratePerHour,
            tenantStaffId: this.tenantStaffId,
            minimumHours: this.minimumHours,
            ...(Array.isArray(this.otherPays) ? { incomeItems: { connect: this.otherPays } } : {}),
            ...(Array.isArray(this.deductions) ? { deductions: { connect: this.deductions } } : {}),
        };
    }
}

export default TenantStaffPayroll
