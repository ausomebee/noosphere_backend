class AppointmentRepository {
    constructor(model, prisma) {
        this.model = model;
        this.prisma = prisma;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async findFirst(query) {
        return await this.model.findFirst({
            where: query,
        });
    }

    async countTenantAppointments(id) {
        return await this.model.count({
            where: {
                tenantId: id,
            },
        });
    }

    async findAll(filter = {}) {
        return await this.model.findMany({
            where: filter,
        });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async update(id, data) {
        return await this.model.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return await this.model.delete({
            where: { id },
        });
    }

    async findFirstDynamic(query) {
        const { where, include, select, orderBy, take, skip } = query;
        return await this.model.findFirst({ where, include, select, orderBy, take, skip });
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate
        });
    }

    getPeriodStart(period) {
        const now = new Date();

        switch (period) {
            case 'year':
                return new Date(now.getFullYear(), now.getMonth() - 11, 1);

            case 'month':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);

            case 'day':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
    }

    async appointmentsMetric(tenantId, status, period) {
        const start = this.getPeriodStart(period);

        const statusFilter =
            status === 'completed'
                ? `a."isCanceled" = false AND a."rescheduled" = false`
                : status === 'canceled'
                    ? `a."isCanceled" = true`
                    : `a."rescheduled" = true`;

        const groupFormat =
            period === 'day'
                ? 'YYYY-MM-DD'
                : period === 'month'
                    ? 'YYYY-MM-DD'
                    : 'YYYY-MM';

        return await this.prisma.$queryRawUnsafe(`
                SELECT 
                TO_CHAR(TO_DATE(a.date, 'YYYY-MM-DD'), '${groupFormat}') AS period,
                COUNT(*)::int AS count
                FROM "Appointment" a
                WHERE 
                a."tenantId" = '${tenantId}'
                AND ${statusFilter}
                AND TO_DATE(a.date, 'YYYY-MM-DD') >= '${start.toISOString().split('T')[0]}'
                GROUP BY period
                ORDER BY period ASC;
            `
        );
    }

    async getAppointmentsForTimesheet(appointmentId) {
        const appointment = await this.model.findUnique({
            where: { id: appointmentId },
            include: {
                appointmentServices: {
                    select: {
                        serviceCodeId: true,
                    },
                },
                client: {
                    select: {
                        tenantLinks: {
                            where: { active: true },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        return appointment;
    }

    async getAppointmentsByTenant(tenantId) {
        const appointments = await this.model.findMany({
            where: { tenantId },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        preferredName: true,
                        email: true,
                    },
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                }
            },
            orderBy: { date: "asc" }
        });

        return appointments;
    }

}

export default AppointmentRepository