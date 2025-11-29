import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const dbUser = await prisma.user.findUnique({
                where: { kindeId: user.id },
            });

            if (dbUser) {
                // Determine tier based on amount paid
                const amount = session.amount_total || 0;
                let creditsToAdd = 0;
                let newTier = dbUser.tier;

                let videoCreditsToAdd = 0;

                if (amount === 2000) { // Diamond ($20)
                    creditsToAdd = 100;
                    videoCreditsToAdd = 3;
                    newTier = "Diamond";
                } else if (amount === 3000) { // Solitaire ($30)
                    creditsToAdd = 200;
                    videoCreditsToAdd = 5;
                    newTier = "Solitaire";
                }

                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: dbUser.id },
                        data: {
                            credits: dbUser.credits + creditsToAdd,
                            videoCredits: dbUser.videoCredits + videoCreditsToAdd,
                            tier: newTier,
                        },
                    }),
                    prisma.creditTransaction.create({
                        data: {
                            userId: dbUser.id,
                            amount: creditsToAdd,
                            creditType: "IDEA",
                            type: "PURCHASE",
                            description: `Purchased ${newTier} Plan`
                        }
                    }),
                    prisma.creditTransaction.create({
                        data: {
                            userId: dbUser.id,
                            amount: videoCreditsToAdd,
                            creditType: "VIDEO",
                            type: "PURCHASE",
                            description: `Purchased ${newTier} Plan (Video Credits)`
                        }
                    })
                ]);
                return NextResponse.json({ success: true, tier: newTier, creditsAdded: creditsToAdd });
            }
        }

        return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
    } catch (error) {
        console.error("Stripe Verification Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
