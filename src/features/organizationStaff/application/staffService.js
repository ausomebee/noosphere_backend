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
console.log(createStaffData.createTenantStaff)
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

}

export default TenantStaffService;