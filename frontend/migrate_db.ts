import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize Prisma (Connected to Neon/Postgres via .env)
const prisma = new PrismaClient();

// Initialize SQLite (Connected to local dev.db)
const sqlitePath = path.join(process.cwd(), 'dev.db');
const sqlite = new Database(sqlitePath);

async function migrate() {
    console.log('🚀 Starting migration from SQLite to PostgreSQL...');

    try {
        // 1. Migrate Users
        const users = sqlite.prepare('SELECT * FROM User').all();
        console.log(`Found ${users.length} users to migrate.`);

        for (const user of users) {
            await prisma.user.upsert({
                where: { email: user.email },
                update: {
                    credits: user.credits,
                    tier: user.tier,
                    videoCredits: user.videoCredits,
                    videoGenerations: user.videoGenerations,
                    kindeId: user.kindeId
                },
                create: {
                    id: user.id,
                    email: user.email,
                    kindeId: user.kindeId,
                    credits: user.credits,
                    tier: user.tier,
                    videoCredits: user.videoCredits,
                    videoGenerations: user.videoGenerations,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt)
                }
            });
        }
        console.log('✅ Users migrated.');

        // 2. Migrate Credit Transactions
        const transactions = sqlite.prepare('SELECT * FROM CreditTransaction').all();
        console.log(`Found ${transactions.length} transactions to migrate.`);

        for (const tx of transactions) {
            // Check if user exists first (integrity check)
            const userExists = await prisma.user.findUnique({ where: { id: tx.userId } });
            if (userExists) {
                await prisma.creditTransaction.create({
                    data: {
                        id: tx.id,
                        userId: tx.userId,
                        amount: tx.amount,
                        type: tx.type,
                        description: tx.description,
                        creditType: tx.creditType || 'IDEA', // Default if missing
                        createdAt: new Date(tx.createdAt)
                    }
                }).catch(e => {
                    // Ignore duplicates
                    if (!e.message.includes('Unique constraint')) console.error(`Failed to migrate tx ${tx.id}:`, e.message);
                });
            }
        }
        console.log('✅ Transactions migrated.');

        // 3. Migrate Video Requests
        const videoRequests = sqlite.prepare('SELECT * FROM VideoRequest').all();
        console.log(`Found ${videoRequests.length} video requests to migrate.`);

        for (const req of videoRequests) {
            const userExists = await prisma.user.findUnique({ where: { id: req.userId } });
            if (userExists) {
                await prisma.videoRequest.create({
                    data: {
                        id: req.id,
                        userId: req.userId,
                        ideaTitle: req.ideaTitle,
                        style: req.style,
                        duration: req.duration,
                        tone: req.tone,
                        notes: req.notes,
                        status: req.status,
                        script: req.script,
                        downloadUrl: req.downloadUrl,
                        createdAt: new Date(req.createdAt),
                        updatedAt: new Date(req.updatedAt)
                    }
                }).catch(e => {
                    if (!e.message.includes('Unique constraint')) console.error(`Failed to migrate request ${req.id}:`, e.message);
                });
            }
        }
        console.log('✅ Video Requests migrated.');

        console.log('🎉 Migration complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
        sqlite.close();
    }
}

migrate();
