import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const deleted = await prisma.videoRequest.deleteMany({
        where: {
            status: 'Pending',
            ideaText: ''
        }
    });
    console.log(`Deleted ${deleted.count} failed/empty requests.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
