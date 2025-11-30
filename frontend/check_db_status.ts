import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // 1. Check connection by counting users
        const userCount = await prisma.user.count()
        console.log(`✅ Database Connection: SUCCESS`)
        console.log(`👥 Total Users: ${userCount}`)

        // 2. Check if we can write (optional, but good for "perfect" check)
        // We won't actually write to avoid garbage data, but a read is a good sign.

        // 3. Check for recent transactions (if any)
        const transactionCount = await prisma.creditTransaction.count()
        console.log(`💳 Total Transactions: ${transactionCount}`)

    } catch (e) {
        console.error(`❌ Database Connection: FAILED`)
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
