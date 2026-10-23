import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import AvailabilityDaysRepository from "../../infrastucture/availabilityDaysRepository.js";
import AvailabilityDaysService from "../../application/availabilityDaysService.js";
import AvailabilityDays from "../../domain/availabilityDays.js";

class AvailabilityDaysController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.availabilityDaysRepository = new AvailabilityDaysRepository(
            this.prisma.availabilityDays
        );
        this.service = new AvailabilityDaysService({
            availabilityDaysRepository: this.availabilityDaysRepository
        });
    }

    createAvailabilityDay = expressAsyncHandler(async (req, res) => {
        const data = new AvailabilityDays(req.body);
        const newRecord = await this.service.createAvailabilityDay(
            data.createAvailabilityDay
        );

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create availability day" });
        }

        return res.status(201).json({
            message: "Availability day created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateAvailabilityDay = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateAvailabilityDay(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update availability day" });
        }

        return res.status(201).json({
            message: "Availability day updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleAvailabilityDay = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleAvailabilityDay(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch availability day" });
        }

        return res.status(200).json({
            message: "Availability day fetched successfully",
            status: "ok",
            data: record
        });
    });

    getAvailabilityDays = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getAvailabilityDays(req.params.availabilityId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch availability days" });
        }

        return res.status(200).json({
            message: "Availability days fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default AvailabilityDaysController;
