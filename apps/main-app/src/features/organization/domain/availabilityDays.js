class AvailabilityDays {
    constructor({ id, dayOfWeek, available, from, to, availabilityId }) {
        this.id = id;
        this.dayOfWeek = dayOfWeek;
        this.available = available;
        this.from = from;
        this.to = to;
        this.availabilityId = availabilityId;
    }

    get createAvailabilityDay() {
        return {
            dayOfWeek: this.dayOfWeek,
            available: this.available,
            from: this.from,
            to: this.to,
            availabilityId: this.availabilityId
        };
    }
}

export default AvailabilityDays;
