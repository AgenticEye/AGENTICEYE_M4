import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ transactions: dbUser.transactions });

    } catch (error) {
        console.error('Fetch transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
