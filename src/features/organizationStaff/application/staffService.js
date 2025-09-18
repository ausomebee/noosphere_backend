import TenantStaffDocument from '../domain/document.js';
import TenantStaffLicense from '../domain/license.js';
import TenantStaffPayroll from '../domain/payroll.js';
import TenantStaff from '../domain/staff.js';

class TenantStaffService {
    constructor({ staffRepository, prisma, documentRepository, licenseRepository, payrollRepository }) {
        this.prisma = prisma;
        this.documentRepository = documentRepository;
        this.staffRepository = staffRepository;
        this.licenseRepository = licenseRepository;
        this.payrollRepository = payrollRepository;
    }

    async createTenantStaff(data) {
        const staffExists = await this.staffRepository.findFirst({
            OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
        });

        if (staffExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (staffExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const createStaffData = new TenantStaff(data);

        const newStaff = await this.prisma.$transaction(async (tx) => {
            const staff = await this.staffRepository.txCreate(createStaffData.createTenantStaff, tx.tenantStaff);
            data.documents.forEach((d) => {
                const createDocumentData = new TenantStaffDocument({ ...d, tenantStaffId: staff.id });
                const document = this.documentRepository.txCreate(createDocumentData.createTenantStaffDocuments, tx.tenantStaffDocuments);
            })
            data.licenses.forEach((d) => {
                const createLicenseData = new TenantStaffLicense({ ...d, tenantStaffId: staff.id });
                const license = this.licenseRepository.txCreate(createLicenseData.createTenantStaffLicense, tx.tenantStaffLicenses);
            })
            const createPayrollData = new TenantStaffPayroll({ ...data.payroll, tenantStaffId: staff.id });
            const payroll = await this.payrollRepository.txCreate(createPayrollData.createTenantStaffPayroll, tx.tenantStaffPayroll);

            return { staff };
        }, { timeout: 10_000 });

        if (!newStaff) {
            throw new Error("Failed to create candidate");
        }

        return newStaff.staff;
    }

    async updateTenantStaff(data) {
        const staff = await this.staffRepository.findOne({ id: data.id })

        if (!staff) {
            throw new Error("staff not found");
        }

        const update = await this.staffRepository.update(data.id, {
            fullName: data.fullName || staff.fullName,
            email: data.email || staff.email,
            stage: data.stage || staff.stage,
            roleId: data.roleId || staff.roleId,
            tenantId: data.tenantId || staff.tenantId,
            dob: data.dob || staff.dob,
            gender: data.gender || staff.gender,
            npi: data.npi || staff.npi,
            address: data.address || staff.address,
            city: data.city || staff.city,
            state: data.state || staff.state,
            zip: data.zip || staff.zip,
            country: data.country || staff.country,
            phoneNumber: data.phoneNumber || staff.phoneNumber,
            active: data.active ?? staff.active,
            createdAt: data.createdAt || staff.createdAt,
            updatedAt: data.updatedAt || staff.updatedAt,
            password: data.password || staff.password,
            authType: data.authType || staff.authType,
            authQuestion: data.authQuestion || staff.authQuestion,
            auth2FADone: data.auth2FADone ?? staff.auth2FADone,
            isDeleted: data.isDeleted ?? staff.isDeleted
        });

        if (data.documents) {
            data.documents.forEach(async (d) => {
                const document = await this.documentRepository.findOne({ id: d.id });

                if (!document) {
                    throw new Error("Document not found");
                }

                const update = await this.documentRepository.update(d.id, {
                    documentsUrl: d.documentsUrl || document.documentsUrl,
                    tenantStaffId: d.tenantStaffId || document.tenantStaffId,
                    isDeleted: d.isDeleted ?? document.isDeleted
                });

                if (!update) {
                    throw new Error("Failed to update document");
                }
            })
        }

        if (data.licenses) {
            data.licenses.forEach(async (d) => {
                const license = await this.licenseRepository.findOne({ id: d.id });

                if (!license) {
                    throw new Error("License not found");
                }

                const update = await this.licenseRepository.update(d.id, {
                    licenseName: d.licenseName || license.licenseName,
                    licenseNumber: d.licenseNumber || license.licenseNumber,
                    tenantStaffId: d.tenantStaffId || license.tenantStaffId,
                    issueState: d.issueState || license.issueState,
                    expiryDate: d.expiryDate || license.expiryDate,
                    isDeleted: d.isDeleted ?? license.isDeleted
                });

                if (!update) {
                    throw new Error("Failed to update license");
                }
            })
        }

        if (data.payroll) {
            const payroll = await this.payrollRepository.findOne({ id: data.payroll.id });

            if (!payroll) {
                throw new Error("Payroll not found");
            }

            const update = await this.payrollRepository.update(data.payroll.id, {
                paymentSchedule: data.payroll.paymentSchedule || payroll.paymentSchedule,
                ratePerHour: data.payroll.ratePerHour || payroll.ratePerHour,
                tenantStaffId: data.payroll.tenantStaffId || payroll.tenantStaffId,
                minimumHours: data.payroll.minimumHours || payroll.minimumHours,
                otherPays: data.payroll.otherPays || payroll.otherPays,
                deductions: data.payroll.deductions || payroll.deductions,
                isDeleted: data.payroll.isDeleted ?? payroll.isDeleted
            });

            if (!update) {
                throw new Error("Failed to update payroll");
            }
        }

        if (!update) {
            throw new Error("Failed to update staff");
        }

        return update;
    }

    async getTenantStaffs(tenantId) {
        const staffs = await this.staffRepository.findAllAndPopulate({ tenantId, isDeleted: false }, { role: true });

        if (!staffs) {
            throw new Error("Staffs not found")
        }

        return staffs;
    }

    async getStaff(id) {
        const staff = await this.staffRepository.findFirstDynamic({ where: { id }, include: { role: true } });

        if (!staff) {
            throw new Error("Staff not found")
        }

        return staff;
    }

    async getStaffDetails(id) {
        const staff = await this.staffRepository.findFirstDynamic({ where: { id }, include: { role: true } });
        const payroll = await this.payrollRepository.findFirst({ tenantStaffId: staff.id });
        const license = await this.licenseRepository.findAll({ tenantStaffId: staff.id });
        const document = await this.documentRepository.findAll({ tenantStaffId: staff.id });


        if (!staff) {
            throw new Error("Staff not found")
        }

        return { staff, payroll, license, document };
    }

}

export default TenantStaffService;