import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const requests = await prisma.videoRequest.findMany();
    console.log("Current Requests:");
    requests.forEach(r => {
        console.log(`- ID: ${r.id}, Title: ${r.ideaTitle}, Status: ${r.status}, HasScript: ${!!r.ideaText && r.ideaText.length > 0}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
