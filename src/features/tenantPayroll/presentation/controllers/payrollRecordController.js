import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PayrollRecordRepository from "../../infrastructure/payrollRecordRepository.js";
import PayrollRecordService from "../../application/payrollRecordService.js";
import PayrollRecord from "../../domain/payrollRecord.js";

class PayrollRecordController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.payrollRecordRepository = new PayrollRecordRepository(this.prisma.payrollRecord);
        this.service = new PayrollRecordService({ payrollRecordRepository: this.payrollRecordRepository });
    }

    createPayrollRecord = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const recordData = new PayrollRecord(data);
        const payrollRecord = await this.service.createPayrollRecord(recordData.createPayrollRecord);

        if (!payrollRecord) {
            return res.status(500).json({ message: "Failed to create payroll record" });
        }

        return res.status(201).json({
            message: "Payroll record created successfully",
            status: "ok",
            data: payrollRecord
        });
    });

    updatePayrollRecord = expressAsyncHandler(async (req, res) => {
        const payrollRecord = await this.service.updatePayrollRecord(req.body);

        if (!payrollRecord) {
            return res.status(500).json({ message: "Failed to update payroll record" });
        }

        return res.status(200).json({
            message: "Payroll record updated successfully",
            status: "ok",
            data: payrollRecord
        });
    });

    getSinglePayrollRecord = expressAsyncHandler(async (req, res) => {
        const payrollRecord = await this.service.getSinglePayrollRecord(req.params);

        if (!payrollRecord) {
            return res.status(404).json({ message: "Payroll record not found" });
        }

        return res.status(200).json({
            message: "Payroll record fetched successfully",
            status: "ok",
            data: payrollRecord
        });
    });

    getPayrollRecordsByCycle = expressAsyncHandler(async (req, res) => {
        const payrollRecords = await this.service.getPayrollRecordsByCycle(req.params.payrollCycleId);

        if (!payrollRecords || payrollRecords.length === 0) {
            return res.status(404).json({ message: "No payroll records found" });
        }

        return res.status(200).json({
            message: "Payroll records fetched successfully",
            status: "ok",
            data: payrollRecords
        });
    });
}

export default PayrollRecordController;
