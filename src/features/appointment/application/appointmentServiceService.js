class AppointmentServiceService {
    constructor({ appointmentServiceRepository }) {
        this.appointmentServiceRepository = appointmentServiceRepository;
    }

    async createAppointmentService(data) {
        const exists =
            await this.appointmentServiceRepository.findFirstDynamic({
                where: {
                    serviceCodeId: data.serviceCodeId,
                    appointmentId: data.appointmentId,
                },
                select: { id: true },
            });

        if (exists) {
            throw new Error(
                "Service code already exists for this appointment."
            );
        }

        const newRecord =
            await this.appointmentServiceRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create appointment service");
        }

        return newRecord;
    }

    async updateAppointmentService(data) {
        const record =
            await this.appointmentServiceRepository.findOne({
                id: data.id,
            });

        if (!record) {
            throw new Error("Appointment service not found");
        }

        const update =
            await this.appointmentServiceRepository.update(data.id, {
                modifiers: data.modifiers || record.modifiers,
                serviceCodeId:
                    data.serviceCodeId || record.serviceCodeId,
                appointmentId:
                    data.appointmentId || record.appointmentId,
            });

        if (!update) {
            throw new Error("Failed to update appointment service");
        }

        return update;
    }

    async getSingleAppointmentService(id) {
        const record =
            await this.appointmentServiceRepository.findOne({ id });

        if (!record) {
            throw new Error("Appointment service not found");
        }

        return record;
    }

    async getAppointmentServices(appointmentId) {
        const records =
            await this.appointmentServiceRepository.findAllAndPopulate(
                { appointmentId },
                { serviceCode: true }
            );

        if (!records) {
            throw new Error("Appointment services not found");
        }

        return records;
    }
}

export default AppointmentServiceService;
