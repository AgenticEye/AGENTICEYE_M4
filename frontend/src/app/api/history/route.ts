import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoUrl, result } = await req.json();

    const dbUser = await prisma.user.findUnique({
        where: { kindeId: user.id },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.analysis.create({
        data: {
            userId: dbUser.id,
            videoUrl,
            result: JSON.stringify(result),
        },
    });

    return NextResponse.json({ success: true });
}

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { kindeId: user.id },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let takeLimit = 1; // Default Free
    if (dbUser.tier === 'Diamond') takeLimit = 50;
    if (dbUser.tier === 'Solitaire') takeLimit = 1000; // Effectively all

    const history = await prisma.analysis.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        take: takeLimit,
    });

    return NextResponse.json({ history });
}
