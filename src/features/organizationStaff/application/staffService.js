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
        const createPayrollData = new TenantStaffPayroll(data);
        
        const newStaff = await this.prisma.$transaction(async (tx) => {
            const staff = await this.staffRepository.txCreate(createStaffData.createTenantStaff, tx.tenantStaff);
            data.document.forEach((d)=>{
                const createDocumentData = new TenantStaffDocument(d);
                const document = this.documentRepository.txCreate(createDocumentData.createTenantStaffDocuments, tx.tenantStaffDocuments);
            })
            data.license.forEach((d)=>{
                const createLicenseData = new TenantStaffLicense(d);
                const license = this.licenseRepository.txCreate(createLicenseData.createTenantStaffLicense, tx.tenantStaffLicenses);
            })
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
            throw new Error("tenant not found");
        }

        const update = await this.staffRepository.update(data.id, {
            fullName: data.fullName || tenant.fullName,
            email: data.email || tenant.email,
            stage: data.stage || tenant.stage,
            roleId: data.roleId || tenant.roleId,
            tenantId: data.tenantId || tenant.tenantId,
            dob: data.dob || tenant.dob,
            gender: data.gender || tenant.gender,
            npi: data.npi || tenant.npi,
            address: data.address || tenant.address,
            city: data.city || tenant.city,
            state: data.state || tenant.state,
            zip: data.zip || tenant.zip,
            country: data.country || tenant.country,
            phoneNumber: data.phoneNumber || tenant.phoneNumber,
            active: data.active ?? tenant.active,
            createdAt: data.createdAt || tenant.createdAt,
            updatedAt: data.updatedAt || tenant.updatedAt,
            password: data.password || tenant.password,
            authType: data.authType || tenant.authType,
            authQuestion: data.authQuestion || tenant.authQuestion,
            auth2FADone: data.auth2FADone ?? tenant.auth2FADone,
            isDeleted: data.isDeleted ?? tenant.isDeleted
        });

        if (!update) {
            throw new Error("Failed to update staff");
        }

        return update;
    }

    async getTenantStaffs(tenantId) {
        const staffs = await this.tenantRepository.findAllAndPopulate({tenantId, active: true, isDeleted: false});

        if (!staffs) {
            throw new Error("Staffs not found")
        }

        return staffs;
    }

    async getStaff(id) {
        const staff = await this.staffRepository.findFirst({ id });

        if (!staff) {
            throw new Error("Staff not found")
        }

        return staff;
    }

}

export default TenantStaffService;