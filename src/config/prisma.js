import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

const createdAtModels = new Set([
    'Admin', 'Auth', 'Department', 'Role', 'RefreshTokens', 'Tenant', 'TenantStaff',
    'TenantNotificationSettings', 'Teams', 'TenantStaffDocuments', 'Client', 'ClientTenant',
    'ClientDocuments', 'ClientRequestedDocuments', 'ClientNotificationSettings', 'Pipeline',
    'PipelineStage', 'PipelineItem', 'PipelineDoneTask', 'PipelineItemCustomTask',
    'PipelineItemCustomDocument', 'Subscription', 'BillingPlan', 'Feature', 'FeatureGroup',
    'SuperAdminChoices', 'TenantAdminChoices', 'Payment', 'Logs', 'Invoice', 'InvoiceToken',
    'PaymentMethod', 'Issue', 'IssueComment', 'Domain', 'Program', 'Target', 'ClientProgram',
    'ClientTarget', 'ClientTargetDataCollection', 'OrganizationDocuments', 'SessionTypeService',
    'AppointmentRescheduleRequest', 'Forms', 'ClientForm', 'Session', 'SessionData',
    'SessionApproval', 'TimesheetHistory', 'SessionUpdateRequest', 'ClientFolder', 'ClientFiles',
    'ClinicalReportTemplates', 'ClinicalReport', 'ClinicalReportHistory',
    'ClinicalReportChangeRequest', 'ClinicalReportVersion', 'TenantGeneralSettings',
    'TenantAdditionalSecurityQuestions', 'Message', 'Notification', 'ServerRequest'
]);

class PrismaService {
    constructor() {
        this.adapter = new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` })
        this.prisma = new PrismaClient({ adapter: this.adapter }).$extends({
            query: {
                $allModels: {
                    async findMany({ model, args, query }) {
                        if (!args.orderBy && createdAtModels.has(model)) {
                            args.orderBy = { createdAt: 'desc' };
                        }

                        return query(args);
                    }
                }
            }
        });
    }

    async connect() {
        try {
            await this.prisma.$connect();
            console.log('✅ PostgreSQL connected via Prisma');
        } catch (error) {
            console.error('❌ PostgreSQL connection error:', error);
            process.exit(1);
        }
    }

    getClient() {
        return this.prisma;
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }
}

const prismaService = new PrismaService();
export default prismaService;