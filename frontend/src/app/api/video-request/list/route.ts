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
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const requests = await prisma.videoRequest.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ requests });

    } catch (error) {
        console.error('Fetch video requests error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
