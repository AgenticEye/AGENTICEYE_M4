import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

let stripe: Stripe | null = null;
try {
    if (process.env.STRIPE_SECRET_KEY) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-01-27.acacia" as any,
        });
    } else {
        console.error("STRIPE_SECRET_KEY is missing in environment variables");
    }
} catch (e) {
    console.error("Failed to initialize Stripe:", e);
}

export async function POST(req: Request) {
    try {
        if (!stripe) {
            console.error("Stripe is not initialized");
            return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
        }

        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { priceId } = body;

        // Get user from DB to ensure they exist
        const dbUser = await prisma.user.findUnique({
            where: { kindeId: user.id },
        });

        if (!dbUser) {
            // Auto-create user if missing (fallback)
            const newUser = await prisma.user.create({
                data: {
                    kindeId: user.id,
                    email: user.email || "",
                }
            });
            if (!newUser) return NextResponse.json({ error: "User not found and creation failed" }, { status: 404 });
        }

        const targetUserId = dbUser ? dbUser.id : user.id; // Should use dbUser.id if available

        const priceConfig = priceId === 'solitaire'
            ? {
                name: "Solitaire Plan - 200 Credits",
                description: "For agencies & power users. 200 credits + 5 video gens.",
                amount: 3000, // $30.00
            }
            : {
                name: "Diamond Plan - 100 Credits",
                description: "Unlock viral potential with 100 analyses per month.",
                amount: 2000, // $20.00
            };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: priceConfig.name,
                            description: priceConfig.description,
                        },
                        unit_amount: priceConfig.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.KINDE_SITE_URL || 'http://localhost:3000'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.KINDE_SITE_URL || 'http://localhost:3000'}/pricing`,
            metadata: {
                userId: targetUserId,
                kindeId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
