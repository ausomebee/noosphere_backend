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
    async completedAppointmentsMetric(tenantId) {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)

        return await this.prisma.$queryRaw`
        SELECT 
            TO_CHAR(TO_DATE(a.date, 'YYYY-MM-DD'), 'YYYY-MM') AS month,
            COUNT(*)::int AS count
        FROM "Appointment" a
        WHERE 
            a."tenantId" = ${tenantId}
            AND a."isCanceled" = false
            AND a."rescheduled" = false
            AND TO_DATE(a.date, 'YYYY-MM-DD') >= ${start}
        GROUP BY month
        ORDER BY month ASC;
    `
    }
    async canceledAppointmentsMetric(tenantId) {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)

        return await this.prisma.$queryRaw`
        SELECT 
            TO_CHAR(TO_DATE(a.date, 'YYYY-MM-DD'), 'YYYY-MM') AS month,
            COUNT(*)::int AS count
        FROM "Appointment" a
        WHERE 
            a."tenantId" = ${tenantId}
            AND a."isCanceled" = true
            AND TO_DATE(a.date, 'YYYY-MM-DD') >= ${start}
        GROUP BY month
        ORDER BY month ASC;
    `
    }
    async rescheduledAppointmentsMetric(tenantId) {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)

        return await this.prisma.$queryRaw`
        SELECT 
            TO_CHAR(TO_DATE(a.date, 'YYYY-MM-DD'), 'YYYY-MM') AS month,
            COUNT(*)::int AS count
        FROM "Appointment" a
        WHERE 
            a."tenantId" = ${tenantId}
            AND a."rescheduled" = true
            AND TO_DATE(a.date, 'YYYY-MM-DD') >= ${start}
        GROUP BY month
        ORDER BY month ASC;
    `
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