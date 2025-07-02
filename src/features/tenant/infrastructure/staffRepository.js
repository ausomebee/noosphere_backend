import BaseRepository from "./baseRepository.js";

class StaffRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.tenantStaff.create({ data });
    }

    async staffExistsWithRole(email) {
        return await this.model.findFirst({
            where: {
                email
            },
            include: {
                role: {
                    select: {
                        name: true
                    }
                }
            }
        });
    }

    async updateAll(data) {
        return await this.model.updateMany({
            data: { ...data },
        });
    }
}

export default StaffRepository;