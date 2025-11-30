import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ADMIN_EMAIL = "thilak200427@gmail.com"; // Hardcoded for now, or use env

// GET: List all requests (Admin only)
// POST: Update request status
export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const requests = await prisma.videoRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    return NextResponse.json({ requests });
}

export async function POST(req: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, status, downloadUrl } = body;

    const updatedRequest = await prisma.videoRequest.update({
        where: { id: requestId },
        data: {
            status,
            downloadUrl: downloadUrl || undefined
        }
    });

    return NextResponse.json({ success: true, request: updatedRequest });
}
