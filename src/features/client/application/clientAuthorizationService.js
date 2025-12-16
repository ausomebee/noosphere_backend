class ClientAuthorizationService {
    constructor({ clientAuthorizationRepository }) {
        this.clientAuthorizationRepository = clientAuthorizationRepository;
    }

    async createClientAuthorization(data) {
        const existing = await this.clientAuthorizationRepository.findFirstDynamic({
            where: {
                authorizationNumber: data.authorizationNumber,
                tenantClientId: data.tenantClientId
            },
            select: { id: true }
        });

        if (existing) {
            throw new Error("An authorization with this number already exists for this client.");
        }

        const newAuth = await this.clientAuthorizationRepository.create(data);

        if (!newAuth) {
            throw new Error("Failed to create Client Authorization");
        }

        return newAuth;
    }

    async updateClientAuthorization(data) {
        const auth = await this.clientAuthorizationRepository.findOne({ id: data.id });

        if (!auth) {
            throw new Error("Client Authorization not found");
        }

        const update = await this.clientAuthorizationRepository.update(data.id, {
            title: data.title ?? auth.title,
            authorizationNumber: data.authorizationNumber ?? auth.authorizationNumber,
            startDate: data.startDate ?? auth.startDate,
            endDate: data.endDate ?? auth.endDate,
            payer: data.payer ?? auth.payer,
            insuranceType: data.insuranceType ?? auth.insuranceType,
            isDeleted: data.isDeleted ?? auth.isDeleted,
            isActive: data.isActive ?? auth.isActive,
        });

        if (!update) {
            throw new Error("Failed to update Client Authorization");
        }

        return update;
    }

    async getSingleClientAuthorization(data) {
        const auth = await this.clientAuthorizationRepository.findOne({ id: data.id });

        if (!auth) {
            throw new Error("Client Authorization not found");
        }

        return auth;
    }

    async getClientAuthorizations(tenantClientId) {
        const auths = await this.clientAuthorizationRepository.findAllAndPopulate({ tenantClientId }, { payerDetails: true, insurance: true });

        if (!auths) {
            throw new Error("Client Authorizations not found");
        }

        return auths;
    }

    getAuthorizationFilters(status) {
        const now = new Date();

        return {
            active: {
                endDate: { gt: now.toISOString() },
            },

            expiring: {
                endDate: { gt: now.toISOString() },
            },

            expired: {
                endDate: { lte: now.toISOString() },
            },
        }[status];
    }

    percentRemaining(startStr, endStr) {
        const now = new Date();
        const start = new Date(startStr);
        const end = new Date(endStr);
        return (end - now) / (end - start);
    }

    async getClientAuthorizationsSummary(tenantId, status) {
        const broadWhere = this.getAuthorizationFilters(status);
        const auths = await this.clientAuthorizationRepository.getClientAuthorizationsByStatus(tenantId, broadWhere);

        if (!auths) {
            throw new Error("Client Authorizations not found");
        }

        let filteredRows;

        if (status === "active") {
            filteredRows = auths.filter(r => this.percentRemaining(r.startDate, r.endDate) > 0.25);
        } else if (status === "expiring") {
            filteredRows = auths.filter(r => {
                const p = this.percentRemaining(r.startDate, r.endDate);
                return p <= 0.25 && p > 0;
            });
        } else if (status === "expired") {
            filteredRows = auths.filter(r => this.percentRemaining(r.startDate, r.endDate) <= 0);
        }

        return {
            count: filteredRows.length,
            rows: filteredRows,
        };
    }

    async countAuthorizationStatsByTenant(tenantId) {
        const today = new Date();
        const authorizations = await this.clientAuthorizationRepository.countAuthorizationStatsByTenant(tenantId);

        let active = 0;
        let expiring = 0;
        let expired = 0;

        for (const auth of authorizations) {
            const start = new Date(auth.startDate);
            const end = new Date(auth.endDate);

            const totalDuration = end - start;
            const remaining = end - today;
            const threshold = totalDuration * 0.25;

            if (remaining <= 0) {
                expired++;
            } else if (remaining <= threshold) {
                expiring++;
            } else {
                active++;
            }
        }

        return {
            active,
            expiring,
            expired,
            total: authorizations.length,
        };
    }

}

export default ClientAuthorizationService;