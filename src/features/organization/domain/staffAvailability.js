class StaffAvailability {
    constructor({ id, staffId, availabilityDays }) {
        this.id = id;
        this.staffId = staffId;
        this.availabilityDays = availabilityDays;
    }

    get createStaffAvailability() {
        return {
            staffId: this.staffId,
        };
    }
}

export default StaffAvailability;
