import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body = {};
    try {
        body = await req.json();
    } catch (e) {
        // Body might be empty
    }

    const { amount = 1, description = "Analyzed video content" } = body as any;
    const deductAmount = Math.abs(amount); // Ensure positive

    const dbUser = await prisma.user.findUnique({
        where: { kindeId: user.id },
    });

    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.credits < deductAmount) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    // Deduct credit and log transaction
    await prisma.$transaction([
        prisma.user.update({
            where: { id: dbUser.id },
            data: { credits: dbUser.credits - deductAmount },
        }),
        prisma.creditTransaction.create({
            data: {
                userId: dbUser.id,
                amount: -deductAmount,
                creditType: "IDEA",
                type: "USAGE",
                description: description
            }
        })
    ]);

    return NextResponse.json({ success: true, remaining: dbUser.credits - deductAmount });
}
