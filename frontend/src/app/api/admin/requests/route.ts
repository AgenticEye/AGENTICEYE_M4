import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// TODO: Add Admin Authentication Middleware
export async function GET() {
    try {
        const requests = await prisma.videoRequest.findMany({
            include: {
                user: {
                    select: { email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Admin fetch requests error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
