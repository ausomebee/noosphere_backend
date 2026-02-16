class PayrollCycle {
    constructor({
        id,
        tenantId,
        name,
        compensationType,
        interval,
        startDate,
        autoRun,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.compensationType = compensationType;
        this.interval = interval;
        this.startDate = startDate;
        this.autoRun = autoRun;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createPayrollCycle() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            compensationType: this.compensationType,
            interval: this.interval,
            startDate: this.startDate,
            autoRun: this.autoRun,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }

    get updatePayrollCycle() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            name: this.name,
            compensationType: this.compensationType,
            interval: this.interval,
            startDate: this.startDate,
            autoRun: this.autoRun,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default PayrollCycle;
