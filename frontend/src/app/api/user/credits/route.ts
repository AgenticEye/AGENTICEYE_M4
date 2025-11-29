import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user in DB
    let dbUser = await prisma.user.findUnique({
        where: { kindeId: user.id },
    });

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                kindeId: user.id,
                email: user.email || "",
            },
        });
    }

    return NextResponse.json({
        credits: dbUser.credits,
        tier: dbUser.tier,
        videoGenerations: dbUser.videoGenerations,
        videoCredits: dbUser.videoCredits
    });
}
