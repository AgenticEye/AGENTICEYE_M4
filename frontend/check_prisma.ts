import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Prisma Client models...');

    const models = Object.keys(prisma);
    console.log('Available keys on prisma instance:', models);

    // Check specific models
    // @ts-ignore
    if (prisma.videoRequest) {
        console.log('✅ videoRequest model exists');
    } else {
        console.error('❌ videoRequest model MISSING');
    }

    // @ts-ignore
    if (prisma.creditTransaction) {
        console.log('✅ creditTransaction model exists');
    } else {
        console.error('❌ creditTransaction model MISSING');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
