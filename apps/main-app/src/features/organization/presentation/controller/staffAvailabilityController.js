import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import StaffAvailabilityRepository from "../../infrastucture/staffAvailabilityRepository.js";
import StaffAvailabilityService from "../../application/staffAvailabilityService.js";
import StaffAvailability from "../../domain/staffAvailability.js";
import AvailabilityDaysRepository from "../../infrastucture/availabilityDaysRepository.js";
import AvailabilityDaysService from "../../application/availabilityDaysService.js";
import AvailabilityDays from "../../domain/availabilityDays.js";

class StaffAvailabilityController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.staffAvailabilityRepository = new StaffAvailabilityRepository(
            this.prisma.staffAvailability
        );
        this.service = new StaffAvailabilityService({
            staffAvailabilityRepository: this.staffAvailabilityRepository
        });
        this.availabilityDaysRepository = new AvailabilityDaysRepository(
            this.prisma.availabilityDays
        );
        this.availabilityDaysService = new AvailabilityDaysService({
            availabilityDaysRepository: this.availabilityDaysRepository
        });
    }

    createStaffAvailability = expressAsyncHandler(async (req, res) => {
        const data = new StaffAvailability(req.body);
        const newRecord = await this.service.createStaffAvailability(
            data.createStaffAvailability
        );

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create staff availability" });
        }

        for (const ad of req.body.availabilityDays) {
            const availabilityDaydata = new AvailabilityDays({...ad, availabilityId: newRecord.id});
            const newAvailabilityDay = await this.availabilityDaysService.createAvailabilityDay(
                availabilityDaydata.createAvailabilityDay
            );

            if (!newAvailabilityDay) {
                return res.status(500).json({ message: "Failed to create availability day" });
            }
        }

        return res.status(201).json({
            message: "Staff availability created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateStaffAvailability = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateStaffAvailability(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update staff availability" });
        }

        for (const ad of req.body.availabilityDays) {
            const updateAvailabilityDay = await this.availabilityDaysService.updateAvailabilityDay(ad);

            if (!updateAvailabilityDay) {
                return res.status(500).json({ message: "Failed to update availability day" });
            }
        }

        return res.status(201).json({
            message: "Staff availability updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleStaffAvailability = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleStaffAvailability(req.params.id);

        if (!record) {
            return res.status(500).json({ message: "Failed to fetch staff availability" });
        }

        return res.status(200).json({
            message: "Staff availability fetched successfully",
            status: "ok",
            data: record
        });
    });

    getStaffAvailabilities = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getStaffAvailabilities(req.params.staffId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch staff availabilities" });
        }

        return res.status(200).json({
            message: "Staff availabilities fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default StaffAvailabilityController;
