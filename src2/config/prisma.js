import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

class PrismaService {
    constructor() {
        this.adapter = new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` })
        this.prisma = new PrismaClient({ adapter: this.adapter });
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
}

const prismaService = new PrismaService();
export default prismaService;