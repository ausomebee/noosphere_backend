import { PrismaClient } from '@prisma/client';

class PrismaService {
    constructor() {
        this.prisma = new PrismaClient();
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