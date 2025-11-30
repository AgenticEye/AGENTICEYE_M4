import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            tier: true,
            credits: true
        }
    })

    console.log("--- CURRENT USER PLANS ---")
    users.forEach(u => {
        console.log(`📧 ${u.email} | 💎 Plan: ${u.tier} | 🪙 Credits: ${u.credits}`)
    })
}

main()
