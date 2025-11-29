import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is missing in process.env when initializing Prisma Client");
    }
    // Force reload comment
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
