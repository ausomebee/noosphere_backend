class TenantGeneralSettings {
    constructor({ id, tenantId, dateFormat, timeFormat, currency }) {
        this.id = id;
        this.tenantId = tenantId;
        this.dateFormat = dateFormat;
        this.timeFormat = timeFormat;
        this.currency = currency;
    }

    get createSettings() {
        return {
            tenantId: this.tenantId,
            dateFormat: this.dateFormat,
            timeFormat: this.timeFormat,
            currency: this.currency
        };
    }
}

export default TenantGeneralSettings;
