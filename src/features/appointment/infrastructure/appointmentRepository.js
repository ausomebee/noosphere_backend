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

    async getUpcomingAppointments(clientId, fromDate = new Date(), limit = 100) {
        // Get all non-canceled appointments for the client
        const appointments = await this.model.findMany({
            where: {
                clientId: clientId,
                isCanceled: false,
                OR: [
                    // Non-recurring appointments on or after fromDate
                    {
                        isRecurring: false,
                        date: {
                            gte: this.formatDate(fromDate)
                        }
                    },
                    // Recurring appointments that started before or on fromDate
                    // OR will start in the future
                    {
                        isRecurring: true,
                        date: {
                            lte: this.formatDate(new Date(fromDate.getTime() + 365 * 24 * 60 * 60 * 1000)) // Look ahead 1 year
                        }
                    }
                ]
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        preferredName: true,
                        email: true
                    }
                },
                session: true,
                appointmentServices: {
                    include: {
                        serviceCode: true
                    }
                },
                clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        // Expand recurring appointments
        const expandedAppointments = [];
        const fromDateStr = this.formatDate(fromDate);

        for (const appointment of appointments) {
            if (!appointment.isRecurring) {
                // Add non-recurring appointments as-is
                if (appointment.date >= fromDateStr) {
                    expandedAppointments.push({
                        ...appointment,
                        isRecurringInstance: false,
                        parentAppointmentId: null
                    });
                }
            } else {
                // Expand recurring appointments
                const instances = this.generateRecurringInstances(
                    appointment,
                    fromDate,
                    limit
                );
                expandedAppointments.push(...instances);
            }
        }

        // Sort by date and time
        expandedAppointments.sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.startTime.localeCompare(b.startTime);
        });

        // Limit results
        return expandedAppointments.slice(0, limit);
    }

    generateRecurringInstances(appointment, fromDate, maxInstances = 100) {
        const instances = [];
        const recurrence = appointment.recurrence;
        const startDate = new Date(appointment.date);
        const currentDate = new Date(fromDate);

        // Determine end date for recurrence
        let endDate = null;
        if (recurrence.endType === 'on' && recurrence.endDate) {
            endDate = new Date(recurrence.endDate);
        } else if (recurrence.endType === 'after' && recurrence.occurrences) {
            // Calculate end date based on occurrences
            endDate = this.calculateEndDateFromOccurrences(
                startDate,
                recurrence.type,
                recurrence.occurrences
            );
        }
        // If endType is 'never', endDate remains null

        let currentInstanceDate = new Date(startDate);
        let instanceCount = 0;

        // If fromDate is after the start date, advance to the first occurrence on or after fromDate
        if (currentDate > startDate) {
            currentInstanceDate = this.getNextOccurrence(startDate, currentDate, recurrence.type);
        }

        while (instanceCount < maxInstances) {
            // Stop if we've passed the end date
            if (endDate && currentInstanceDate > endDate) {
                break;
            }

            // Stop if we're looking too far ahead (e.g., 2 years)
            const twoYearsFromNow = new Date(fromDate);
            twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
            if (currentInstanceDate > twoYearsFromNow) {
                break;
            }

            // Create instance
            instances.push({
                ...appointment,
                id: `${appointment.id}_${this.formatDate(currentInstanceDate)}`, // Unique ID for instance
                date: this.formatDate(currentInstanceDate),
                isRecurringInstance: true,
                parentAppointmentId: appointment.id,
                instanceDate: this.formatDate(currentInstanceDate)
            });

            instanceCount++;

            // Move to next occurrence
            currentInstanceDate = this.getNextOccurrenceDate(currentInstanceDate, recurrence.type);
        }

        return instances;
    }

    getNextOccurrence(startDate, targetDate, recurrenceType) {
        const start = new Date(startDate);
        const target = new Date(targetDate);
        let current = new Date(start);

        switch (recurrenceType) {
            case 'day':
                // Calculate days difference and advance
                const daysDiff = Math.ceil((target - start) / (1000 * 60 * 60 * 24));
                current.setDate(start.getDate() + daysDiff);
                break;

            case 'week':
                const weeksDiff = Math.ceil((target - start) / (1000 * 60 * 60 * 24 * 7));
                current.setDate(start.getDate() + (weeksDiff * 7));
                break;

            case 'month':
                current = new Date(target);
                current.setDate(start.getDate());
                if (current < target) {
                    current.setMonth(current.getMonth() + 1);
                }
                break;

            case 'year':
                current = new Date(target);
                current.setMonth(start.getMonth());
                current.setDate(start.getDate());
                if (current < target) {
                    current.setFullYear(current.getFullYear() + 1);
                }
                break;

            default:
                current = new Date(target);
        }

        return current;
    }

    getNextOccurrenceDate(currentDate, recurrenceType) {
        const next = new Date(currentDate);

        switch (recurrenceType) {
            case 'day':
                next.setDate(next.getDate() + 1);
                break;

            case 'week':
                next.setDate(next.getDate() + 7);
                break;

            case 'month':
                next.setMonth(next.getMonth() + 1);
                break;

            case 'year':
                next.setFullYear(next.getFullYear() + 1);
                break;

            default:
                next.setDate(next.getDate() + 1);
        }

        return next;
    }

    calculateEndDateFromOccurrences(startDate, recurrenceType, occurrences) {
        const endDate = new Date(startDate);

        switch (recurrenceType) {
            case 'day':
                endDate.setDate(endDate.getDate() + occurrences);
                break;

            case 'week':
                endDate.setDate(endDate.getDate() + (occurrences * 7));
                break;

            case 'month':
                endDate.setMonth(endDate.getMonth() + occurrences);
                break;

            case 'year':
                endDate.setFullYear(endDate.getFullYear() + occurrences);
                break;
        }

        return endDate;
    }

    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async getPastAppointments(clientId, toDate = new Date(), limit = 100) {
        // Get all appointments for the client that could have past instances
        const appointments = await this.model.findMany({
            where: {
                clientId: clientId,
                isCanceled: false,
                OR: [
                    // Non-recurring appointments before toDate
                    {
                        isRecurring: false,
                        date: {
                            lt: this.formatDate(toDate)
                        }
                    },
                    // Recurring appointments that started before toDate
                    {
                        isRecurring: true,
                        date: {
                            lt: this.formatDate(toDate)
                        }
                    }
                ]
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        preferredName: true,
                        email: true
                    }
                },
                session: true,
                appointmentServices: {
                    include: {
                        serviceCode: true
                    }
                },
                clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Expand recurring appointments
        const expandedAppointments = [];
        const toDateStr = this.formatDate(toDate);

        for (const appointment of appointments) {
            if (!appointment.isRecurring) {
                // Add non-recurring appointments as-is (they're already in the past)
                expandedAppointments.push({
                    ...appointment,
                    isRecurringInstance: false,
                    parentAppointmentId: null
                });
            } else {
                // Expand recurring appointments for past instances only
                const instances = this.generatePastRecurringInstances(
                    appointment,
                    toDate,
                    limit
                );
                expandedAppointments.push(...instances);
            }
        }

        // Sort by date and time (most recent first)
        expandedAppointments.sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.startTime.localeCompare(a.startTime);
        });

        // Limit results
        return expandedAppointments.slice(0, limit);
    }

    generatePastRecurringInstances(appointment, toDate, maxInstances = 100) {
        const instances = [];
        const recurrence = appointment.recurrence;
        const startDate = new Date(appointment.date);
        const endDate = new Date(toDate);

        // Determine if recurrence has ended
        let recurrenceEndDate = null;
        if (recurrence.endType === 'on' && recurrence.endDate) {
            recurrenceEndDate = new Date(recurrence.endDate);
        } else if (recurrence.endType === 'after' && recurrence.occurrences) {
            recurrenceEndDate = this.calculateEndDateFromOccurrences(
                startDate,
                recurrence.type,
                recurrence.occurrences
            );
        }

        let currentInstanceDate = new Date(startDate);
        let instanceCount = 0;

        // Generate instances from start date up to (but not including) toDate
        while (instanceCount < maxInstances) {
            // Stop if we've reached or passed toDate
            if (currentInstanceDate >= endDate) {
                break;
            }

            // Stop if we've passed the recurrence end date
            if (recurrenceEndDate && currentInstanceDate > recurrenceEndDate) {
                break;
            }

            // Stop if we're looking too far back (e.g., 5 years)
            const fiveYearsAgo = new Date(toDate);
            fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
            if (currentInstanceDate < fiveYearsAgo) {
                break;
            }

            // Create instance
            instances.push({
                ...appointment,
                id: `${appointment.id}_${this.formatDate(currentInstanceDate)}`,
                date: this.formatDate(currentInstanceDate),
                isRecurringInstance: true,
                parentAppointmentId: appointment.id,
                instanceDate: this.formatDate(currentInstanceDate)
            });

            instanceCount++;

            // Move to next occurrence
            currentInstanceDate = this.getNextOccurrenceDate(currentInstanceDate, recurrence.type);
        }

        return instances;
    }

    // Alternative: Get past appointments within a specific date range
    async getPastAppointmentsInRange(clientId, fromDate, toDate, limit = 100) {
        const appointments = await this.model.findMany({
            where: {
                clientId: clientId,
                isCanceled: false,
                OR: [
                    // Non-recurring appointments in range
                    {
                        isRecurring: false,
                        date: {
                            gte: this.formatDate(fromDate),
                            lt: this.formatDate(toDate)
                        }
                    },
                    // Recurring appointments that could have instances in range
                    {
                        isRecurring: true,
                        date: {
                            lt: this.formatDate(toDate)
                        }
                    }
                ]
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        preferredName: true,
                        email: true
                    }
                },
                session: true,
                appointmentServices: {
                    include: {
                        serviceCode: true
                    }
                },
                clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        const expandedAppointments = [];
        const fromDateStr = this.formatDate(fromDate);
        const toDateStr = this.formatDate(toDate);

        for (const appointment of appointments) {
            if (!appointment.isRecurring) {
                // Add non-recurring appointments in range
                if (appointment.date >= fromDateStr && appointment.date < toDateStr) {
                    expandedAppointments.push({
                        ...appointment,
                        isRecurringInstance: false,
                        parentAppointmentId: null
                    });
                }
            } else {
                // Expand recurring appointments for instances in range
                const instances = this.generateRecurringInstancesInRange(
                    appointment,
                    fromDate,
                    toDate,
                    limit
                );
                expandedAppointments.push(...instances);
            }
        }

        // Sort by date and time (most recent first)
        expandedAppointments.sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.startTime.localeCompare(a.startTime);
        });

        return expandedAppointments.slice(0, limit);
    }

    generateRecurringInstancesInRange(appointment, fromDate, toDate, maxInstances = 100) {
        const instances = [];
        const recurrence = appointment.recurrence;
        const startDate = new Date(appointment.date);
        const rangeStart = new Date(fromDate);
        const rangeEnd = new Date(toDate);

        // Determine recurrence end date
        let recurrenceEndDate = null;
        if (recurrence.endType === 'on' && recurrence.endDate) {
            recurrenceEndDate = new Date(recurrence.endDate);
        } else if (recurrence.endType === 'after' && recurrence.occurrences) {
            recurrenceEndDate = this.calculateEndDateFromOccurrences(
                startDate,
                recurrence.type,
                recurrence.occurrences
            );
        }

        // Start from the appointment start date or range start, whichever is later
        let currentInstanceDate = rangeStart > startDate
            ? this.getNextOccurrence(startDate, rangeStart, recurrence.type)
            : new Date(startDate);

        let instanceCount = 0;

        while (instanceCount < maxInstances) {
            // Stop if we've reached or passed the range end
            if (currentInstanceDate >= rangeEnd) {
                break;
            }

            // Stop if we've passed the recurrence end date
            if (recurrenceEndDate && currentInstanceDate > recurrenceEndDate) {
                break;
            }

            // Only add if within range
            if (currentInstanceDate >= rangeStart && currentInstanceDate < rangeEnd) {
                instances.push({
                    ...appointment,
                    id: `${appointment.id}_${this.formatDate(currentInstanceDate)}`,
                    date: this.formatDate(currentInstanceDate),
                    isRecurringInstance: true,
                    parentAppointmentId: appointment.id,
                    instanceDate: this.formatDate(currentInstanceDate)
                });
                instanceCount++;
            }

            // Move to next occurrence
            currentInstanceDate = this.getNextOccurrenceDate(currentInstanceDate, recurrence.type);
        }

        return instances;
    }

    // Helper method to get appointments by month (useful for calendar views)
    async getAppointmentsByMonth(clientId, year, month) {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        lastDay.setHours(23, 59, 59, 999);

        return this.getPastAppointmentsInRange(clientId, firstDay, lastDay, 500);
    }

    // Helper method to get all appointments (past and upcoming)
    async getAllAppointments(clientId, limit = 200) {
        const now = new Date();

        const [past, upcoming] = await Promise.all([
            this.getPastAppointments(clientId, now, limit / 2),
            this.getUpcomingAppointments(clientId, now, limit / 2)
        ]);

        return {
            past,
            upcoming,
            total: past.length + upcoming.length
        };
    }
}

export default AppointmentRepository