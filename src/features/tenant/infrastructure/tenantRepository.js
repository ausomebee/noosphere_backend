import BaseRepository from "./baseRepository.js";

class TenantRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.tenant.create({ data });
    }

    async countAllTenants() {
        return await this.model.count();
    }

    async findAllAndPopulate(filter = {}) {
        return await this.model.findMany({
            where: filter,
            include: {
                BillingPlan: {
                    select: {
                        planType: true
                    }
                },
                Subscription: {
                    include: { plan: true }
                },
                accountOfficer: {
                    select: { firstName: true, lastName: true }
                },
                admin: {
                    select: { firstName: true, lastName: true }
                },
            }
        });
    }

}

export default TenantRepository;