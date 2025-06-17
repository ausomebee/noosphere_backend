import Tenant from '../domain/tenant.js';

class TenantService {
    constructor({ tenantRepository, prisma, departmentRepository, roleRepository, staffRepository, pipelineRepository, itemRepository }) {
        this.tenantRepository = tenantRepository;
        this.prisma = prisma;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.staffRepository = staffRepository;
        this.pipelineRepository = pipelineRepository;
        this.itemRepository = itemRepository;
    }

    async createCandidate(data) {
        const tenantExists = await this.tenantRepository.findFirstDynamic({
            where: {
                OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
            },
            select: {
                email: true,
                phoneNumber: true
            }
        });
        if (tenantExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (tenantExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const createData = new Tenant(data)

        const newCandidate = await this.prisma.$transaction(async (tx) => {
            const tenant = await this.tenantRepository.txCreate(createData.createTenant, tx);
            const pipeline = await this.pipelineRepository.txCreate({
                module: "CLIENT",
                name: "Client Onboarding",
                description: "Manage your client intake process seamlessly",
                createdByTenantId: tenant.id
            }, tx);
            const pipelineItem = await this.itemRepository.txCreate({
                tenantId: tenant.id,
                pipelineStageId: data.pipelineStageId,
                assignToAdmin: data.assignToAdmin
            }, tx)
            const department = await this.departmentRepository.createTenantDepartment(tenant.id, tx);
            const role = await this.roleRepository.createTenantRole(department.id, tx);
            const staff = await this.staffRepository.txCreate({ ...createData.createTenantStaff, tenantId: tenant.id, roleId: role.id }, tx);

            return pipelineItem;
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        return newCandidate;
    }

    async updateTenant(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id })

        if (!tenant) {
            throw new Error("tenant not found");
        }

        const update = await this.tenantRepository.update(data.id, {
            email: data.email || tenant.email,
            phoneNumber: data.phoneNumber || tenant.phoneNumber,
            active: data.active ?? tenant.active,
            isDeleted: data.isDeleted ?? tenant.isDeleted,
            companyName: data.companyName || tenant.companyName,
            contactPerson: data.contactPerson || tenant.contactPerson,
            companySize: data.companySize || tenant.companySize,
            organizationType: data.organizationType || tenant.organizationType,
            location: data.location || tenant.location,
            leadSource: data.leadSource || tenant.leadSource,
            stage: data.stage || tenant.stage
        });

        if (!update) {
            throw new Error("Failed to update tenant");
        }

        return update;
    }

    async getAllTenant() {
        const tenants = await this.tenantRepository.findAllAndPopulate({});

        if (!tenants) {
            throw new Error("Tenants not found")
        }

        return tenants;
    }

    async countAllTenant() {
        const totalTenants = await this.tenantRepository.countAllTenants();

        if (!totalTenants) {
            throw new Error("Tenants not found")
        }

        return totalTenants;
    }

}

export default TenantService;