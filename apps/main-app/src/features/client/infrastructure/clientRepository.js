import BaseRepository from "./baseRepository.js";

class ClientRepository extends BaseRepository {
    constructor(model) {
        super(model)
    }

    async txCreate(data, tx) {
        return await tx.client.create({ data });
    }

    async countAllClients() {
        return await this.model.count();
    }

    async countClientsOfPaidTenants() {
        return await this.model.count({
            where: {
                isDeleted: false,
                tenantLinks: {
                    some: {
                        tenant: {
                            Subscription: {
                                some: { status: 'ACTIVE' }
                            }
                        }
                    }
                }
            }
        });
    }

    async getClientsByClinician(staffId, tenantId) {
        return await this.model.findMany({
            where: {
                isDeleted: false,
                OR: [
                    {
                        tenantLinks: {
                            some: {
                                tenantId: tenantId,
                                active: true,
                                clinicians: {
                                    some: {
                                        id: staffId
                                    }
                                }
                            }
                        }
                    },
                    {
                        Appointment: {
                            some: {
                                clinicians: {
                                    some: {
                                        id: staffId
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        });
    }

}

export default ClientRepository;