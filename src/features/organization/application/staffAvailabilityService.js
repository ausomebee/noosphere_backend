class StaffAvailabilityService {
    constructor({ staffAvailabilityRepository }) {
        this.staffAvailabilityRepository = staffAvailabilityRepository;
    }

    async createStaffAvailability(data) {
        const exists = await this.staffAvailabilityRepository.findFirstDynamic({
            where: { staffId: data.staffId },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Staff availability already exists.");
        }

        const newRecord = await this.staffAvailabilityRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Staff Availability.");
        }

        return newRecord;
    }

    async updateStaffAvailability(data) {
        const record = await this.staffAvailabilityRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Staff Availability not found");
        }

        const updated = await this.staffAvailabilityRepository.update(data.id, {
            // staffId: data.staffId || record.staffId
        });

        if (!updated) {
            throw new Error("Failed to update Staff Availability");
        }

        return updated;
    }

    async getSingleStaffAvailability(id) {
        const record = await this.staffAvailabilityRepository.findOne({ id });

        if (!record) {
            throw new Error("Staff Availability not found");
        }

        return record;
    }

    async getStaffAvailabilities(staffId) {
        const records = await this.staffAvailabilityRepository.findAllAndPopulate({ staffId }, {
            availabilityDays: true
        });

        if (!records) {
            throw new Error("Staff Availability records not found");
        }

        return records;
    }
}

export default StaffAvailabilityService;
