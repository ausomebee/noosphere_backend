class AvailabilityDaysService {
    constructor({ availabilityDaysRepository }) {
        this.availabilityDaysRepository = availabilityDaysRepository;
    }

    async createAvailabilityDay(data) {
        const exists = await this.availabilityDaysRepository.findFirstDynamic({
            where: {
                availabilityId: data.availabilityId,
                dayOfWeek: data.dayOfWeek
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Availability for this day already exists.");
        }

        const newRecord = await this.availabilityDaysRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Availability Day.");
        }

        return newRecord;
    }

    async updateAvailabilityDay(data) {
        const record = await this.availabilityDaysRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Availability Day not found");
        }

        const updated = await this.availabilityDaysRepository.update(data.id, {
            dayOfWeek: data.dayOfWeek || record.dayOfWeek,
            available: data.available ?? record.available,
            from: data.from || record.from,
            to: data.to || record.to,
        });

        if (!updated) {
            throw new Error("Failed to update Availability Day");
        }

        return updated;
    }

    async getSingleAvailabilityDay(id) {
        const record = await this.availabilityDaysRepository.findOne({ id });

        if (!record) {
            throw new Error("Availability Day not found");
        }

        return record;
    }

    async getAvailabilityDays(availabilityId) {
        const records = await this.availabilityDaysRepository.findAll({ availabilityId });

        if (!records) {
            throw new Error("Availability Days not found");
        }

        return records;
    }
}

export default AvailabilityDaysService;
