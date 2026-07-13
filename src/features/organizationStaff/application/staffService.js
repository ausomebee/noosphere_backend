import TenantStaffDocument from '../domain/document.js';
import TenantStaffLicense from '../domain/license.js';
import TenantStaffPayroll from '../domain/payroll.js';
import TenantStaff from '../domain/staff.js';
import MailService from '../../../utilities/nodemailer.js';
import templateRenderer from '../../../utilities/templateRenderer.js';
import ReferralCodeGenerator from '../../../utilities/generateCode.js';
import argon2 from 'argon2';

const passwordGenerator = new ReferralCodeGenerator(12);

class TenantStaffService {
    constructor({ staffRepository, prisma, documentRepository, licenseRepository, payrollRepository }) {
        this.prisma = prisma;
        this.documentRepository = documentRepository;
        this.staffRepository = staffRepository;
        this.licenseRepository = licenseRepository;
        this.payrollRepository = payrollRepository;
    }

    async createTenantStaff(data) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: data.tenantId }
        });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }

        const staffExists = await this.staffRepository.findFirst({
            email: data.email,
        });

        if (staffExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        const generatedPass = passwordGenerator.generateStrongPassword();
        const hashedPass = await argon2.hash(generatedPass);
        const createStaffData = new TenantStaff({ ...data, password: hashedPass });

        const newStaff = await this.prisma.$transaction(async (tx) => {
            const staff = await this.staffRepository.txCreate(createStaffData.createTenantStaff, tx.tenantStaff);
            await Promise.all((data.documents ?? []).map((d) => {
                const createDocumentData = new TenantStaffDocument({ ...d, tenantStaffId: staff.id });
                return this.documentRepository.txCreate(createDocumentData.createTenantStaffDocuments, tx.tenantStaffDocuments);
            }));
            await Promise.all((data.licenses ?? []).map((d) => {
                const createLicenseData = new TenantStaffLicense({ ...d, tenantStaffId: staff.id });
                return this.licenseRepository.txCreate(createLicenseData.createTenantStaffLicense, tx.tenantStaffLicenses);
            }));
            const createPayrollData = new TenantStaffPayroll({ ...data.payroll, tenantStaffId: staff.id });
            const payroll = await this.payrollRepository.txCreate(createPayrollData.createTenantStaffPayroll, tx.tenantStaffPayroll);

            return { staff };
        }, { timeout: 10_000 });

        if (!newStaff) {
            throw new Error("Failed to create candidate");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "image/png",
            }
        ];

        const html = templateRenderer.render('tenant-welcome-staff.html', {
            companyName: tenant.companyName,
            email: newStaff.staff.email,
            password: generatedPass,
            staffId: newStaff.staff.id,
            clientUrl: templateRenderer.buildTenantClientUrl(tenant.subdomain),
            subdomain: tenant.subdomain
        });

        const sendMail = await MailService.sendMail(
            newStaff.staff.email,
            "Welcome to Noosphere",
            null,
            html,
            attachments
        );

        if (!sendMail.success) {
            throw new Error(`Failed to send staff welcome email: ${sendMail.error}`);
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

        if (data?.documents?.length > 0) {
            data.documents.forEach(async (d) => {
                if (d.id) {
                    const document = await this.documentRepository.findOne({ id: d.id });
                    const update = await this.documentRepository.update(d.id, {
                        documentsUrl: d.documentsUrl || document.documentsUrl,
                        tenantStaffId: d.tenantStaffId || document.tenantStaffId,
                        isDeleted: d.isDeleted ?? document.isDeleted
                    });

                    if (!update) {
                        throw new Error("Failed to update document");
                    }

                } else {
                    const createDocumentData = new TenantStaffDocument(d);
                    const doc = this.documentRepository.create(createDocumentData.createTenantStaffDocuments)
                    if (!doc) {
                        throw new Error("Failed to create candidate");
                    }
                }
            })
        }

        if (data?.licenses?.length > 0) {
            data.licenses.forEach(async (d) => {
                if (d.id) {
                    const license = await this.licenseRepository.findOne({ id: d.id });

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
                } else {
                    const createLicenseData = new TenantStaffLicense(d);
                    const lic = this.licenseRepository.create(createLicenseData.createTenantStaffLicense);
                    if (!lic) {
                        throw new Error("Failed to add license");
                    }
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
                minimumHours: data.payroll.minimumHours || payroll.minimumHours,
                isDeleted: data.payroll.isDeleted ?? payroll.isDeleted,
                incomeItems: data.payroll.otherPays
                    ? { set: data.payroll.otherPays.map(item => ({ id: item.id })) }
                    : undefined,
                deductions: data.payroll.deductions
                    ? { set: data.payroll.deductions.map(item => ({ id: item.id })) }
                    : undefined,
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
        const payroll = await this.payrollRepository.findOneAndPopulate({ tenantStaffId: staff.id }, { incomeItems: true, deductions: true });
        const license = await this.licenseRepository.findAll({ tenantStaffId: staff.id });
        const document = await this.documentRepository.findAll({ tenantStaffId: staff.id });


        if (!staff) {
            throw new Error("Staff not found")
        }

        return { staff, payroll, license, document };
    }

}

export default TenantStaffService;
