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
            console.log("first")

            return pipelineItem;
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        return newCandidate;
    }
    // constructor() {
    //     this.repository = new TenantRepository()
    //     this.departmentRepository = new DepartmentRepository()
    //     this.roleRepository = new RoleRepository()
    //     this.token = new TokenService()
    // }

    // async createTenant(data) {
    //     const tenantExists = await this.repository.findFirstDynamic({
    //         where: {
    //             OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    //         },
    //         select: {
    //             email: true,
    //             phoneNumber: true
    //         }
    //     });

    //     if (tenantExists?.email === data.email) {
    //         throw new Error("This email is already taken.");
    //     }

    //     if (tenantExists?.phoneNumber === data.phoneNumber) {
    //         throw new Error("This phone number is already taken.");
    //     }

    //     const newTenant = await this.repository.prisma.$transaction(async (tx) => {
    //         const tenant = await this.repository.txCreate(data.createTenant, tx);
    //         const department = await this.departmentRepository.createTenantDepartment(tenant.id, tx);
    //         const role = await this.roleRepository.createTenantRole(department.id, tx)
    //         const staff = await this.repository.createAdminStaff({ ...data.createTenantStaff, tenantId: tenant.id, roleId: role.id }, tx);

    //         return tenant;
    //     });
    //     if (!newTenant) {
    //         throw new Error("Failed to create tenant");
    //     }

    //     return newTenant;
    // }

    // async createTenantStaff(data) {
    //     const staffExists = await this.repository.findFirstDynamicStaff({
    //         where: {
    //             AND: [{ email: data.email }, { phoneNumber: data.phoneNumber }, { tenantId: data.tenantId }],
    //         },
    //         select: {
    //             email: true,
    //             phoneNumber: true,
    //             tenantId: true
    //         }
    //     });

    //     if (staffExists.email === data.email) {
    //         throw new Error("This email is already taken.");
    //     }

    //     if (staffExists.phoneNumber === data.phoneNumber) {
    //         throw new Error("This phone number is already taken.");
    //     }

    //     const hashedPass = await bcrypt.hash(data.password, 50);
    //     data.password = hashedPass;

    //     const newStaff = await this.repository.create(data);

    //     if (!newStaff) {
    //         throw new Error("Failed to create staff");
    //     }

    //     return newStaff;
    // }

    // async staffSignin(data) {
    //     const staff = await this.repository.findOneStaff({
    //         email: data.email
    //     });

    //     if (!staff) {
    //         throw new Error("You don't have an account")
    //     }

    //     if (!bcrypt.compareSync(data.password, admin.password)) {
    //         throw new Error('Incorrect password')
    //     }

    //     return { ...staff, token: this.token.generateToken(staff.id) };
    // }

    // async getSingleStaff(data) {
    //     const staff = await this.repository.findOneStaff({
    //         id: data.id
    //     });

    //     if (!staff) {
    //         throw new Error("Staff not found")
    //     }

    //     return staff;
    // }

    // async updateTenant(data) {
    //     const tenant = await this.repository.findOne({ id: data.id })

    //     if (!tenant) {
    //         throw new Error("Tenant not found");
    //     }

    //     if (data.currentPassword && !(await argon2.verify(tenant.password, data.currentPassword))) {
    //         throw new Error('Incorrect password')
    //     }

    //     const hashedPass = data.password ? await argon2.hash(data.password) : tenant.password;

    //     const update = await this.repository.update(data.id, {
    //         fullName: data.fullName || tenant.fullName,
    //         email: data.email || tenant.email,
    //         phoneNumber: data.phoneNumber || tenant.phoneNumber,
    //         stage: data.stage || tenant.stage,
    //         active: data.active || tenant.active,
    //         password: hashedPass,
    //     });

    //     if (!update) {
    //         throw new Error("Failed to update tenant");
    //     }

    //     return update;
    // }
}

export default TenantService;