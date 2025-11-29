import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { requestId, status, downloadUrl } = body;

        if (!requestId) {
            return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (downloadUrl) updateData.downloadUrl = downloadUrl;
        if (status === 'Completed') updateData.completedAt = new Date();

        const updatedRequest = await prisma.videoRequest.update({
            where: { id: requestId },
            data: updateData,
        });

        return NextResponse.json({ success: true, request: updatedRequest });

    } catch (error) {
        console.error('Admin update request error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
