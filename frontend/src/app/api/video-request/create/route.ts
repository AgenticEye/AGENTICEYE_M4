import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { ideaTitle, ideaText, notes, preferences } = body;

        if (!ideaTitle) {
            return NextResponse.json({ error: 'Idea title is required' }, { status: 400 });
        }

        console.log("Received Video Request Body:", body);

        // Transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get user and check credits
            const dbUser = await tx.user.findUnique({
                where: { email: user.email! },
            });

            if (!dbUser) {
                throw new Error('User not found in database');
            }

            if (dbUser.credits < 10) {
                throw new Error('Insufficient credits');
            }

            // 2. Deduct credit
            await tx.user.update({
                where: { email: user.email! },
                data: { credits: { decrement: 10 } },
            });

            // 3. Create Video Request
            const isCompleted = !!ideaText && ideaText.length > 0;
            const status = isCompleted ? 'Completed' : 'Pending';

            const videoRequest = await tx.videoRequest.create({
                data: {
                    userId: dbUser.id,
                    ideaTitle,
                    ideaText: ideaText || '',
                    notes: notes || '',
                    preferences: JSON.stringify(preferences || {}),
                    status: status,
                    completedAt: isCompleted ? new Date() : null
                },
            });

            // 4. Log Transaction
            await tx.creditTransaction.create({
                data: {
                    userId: dbUser.id,
                    amount: -10,
                    creditType: "VIDEO",
                    type: "USAGE",
                    description: `Video Request: ${ideaTitle}`
                }
            });

            return videoRequest;
        });

        return NextResponse.json({ success: true, request: result });

    } catch (error: any) {
        console.error('Video request error details:', error);
        console.error('Error stack:', error.stack);
        if (error.message === 'Insufficient video credits') {
            return NextResponse.json({ error: 'Insufficient video credits' }, { status: 403 });
        }
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
