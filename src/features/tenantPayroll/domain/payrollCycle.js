class PayrollCycle {
    constructor({
        id,
        tenantId,
        name,
        compensationTypeId,
        interval,
        startDate,
        autoRun,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.compensationTypeId = compensationTypeId;
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
            compensationTypeId: this.compensationTypeId,
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
            compensationTypeId: this.compensationTypeId,
            interval: this.interval,
            startDate: this.startDate,
            autoRun: this.autoRun,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default PayrollCycle;
