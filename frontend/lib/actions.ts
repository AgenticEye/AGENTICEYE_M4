'use server';

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "./prisma";

export async function getUser() {
    try {
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();

        if (!kindeUser) {
            console.log("getUser: No Kinde user found");
            return null;
        }

        let user = await prisma.user.findUnique({
            where: { kindeId: kindeUser.id },
        });

        if (!user) {
            console.log("getUser: Creating new user for Kinde ID", kindeUser.id);
            // Use upsert to handle race conditions where multiple requests try to create the user simultaneously
            user = await prisma.user.upsert({
                where: { kindeId: kindeUser.id },
                update: {},
                create: {
                    kindeId: kindeUser.id,
                    email: kindeUser.email || "",
                    credits: 3,
                    tier: "Free"
                }
            });
        }

        // AUTO-TIER CORRECTION based on credits (User Request: "if I ADD CREDITS -> AUTOMATICALLY UPDATE")
        // If user has high credits but wrong tier, fix it instantly.
        let shouldUpdate = false;
        let newTier = user.tier;

        if (user.credits >= 190 && user.tier !== 'Solitaire') {
            newTier = 'Solitaire';
            shouldUpdate = true;
        } else if (user.credits >= 90 && user.credits < 190 && user.tier === 'Free') {
            newTier = 'Diamond';
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            console.log(`Auto-correcting tier for ${user.email}: ${user.tier} -> ${newTier} (Credits: ${user.credits})`);
            user = await prisma.user.update({
                where: { id: user.id },
                data: { tier: newTier }
            });
        }

        return user;
    } catch (error) {
        console.error("getUser CRITICAL ERROR:", error);
        // Return null instead of throwing to allow the UI to handle it gracefully
        return null;
    }
}

export async function getAnalysis(id: string) {
    console.log("getAnalysis: Fetching analysis", id);
    const user = await getUser();
    if (!user) {
        console.log("getAnalysis: User not found");
        return null;
    }

    const analysis = await prisma.analysis.findUnique({
        where: { id },
    });

    if (!analysis) {
        console.log("getAnalysis: Analysis ID not found in DB");
        return null;
    }

    if (analysis.userId !== user.id) {
        console.log("getAnalysis: User ID mismatch", analysis.userId, user.id);
        return null;
    }

    return analysis;
}

export async function analyzeUrlAction(url: string) {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    if (user.credits <= 0) throw new Error("Insufficient credits");

    try {
        // Use GET request with query params
        const encodedUrl = encodeURIComponent(url);

        // VERCEL-SAFE ENV CHECK
        let baseUrl = process.env.PYTHON_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000';
        if (!process.env.PYTHON_BACKEND_URL && !process.env.NEXT_PUBLIC_BACKEND_URL && !process.env.BACKEND_URL && process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}/api/py`;
        }

        console.log(`Analyzing URL: ${url} using backend: ${baseUrl}`);

        const response = await fetch(`${baseUrl}/m3/analyze?url=${encodedUrl}&tier=${user.tier}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend error:", errorText);
            throw new Error(`Backend returned error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Save to DB
        const analysis = await prisma.analysis.create({
            data: {
                userId: user.id,
                url,
                result: result,
                viralScore: result.m3_generation?.viral_prediction_engine?.score || 0,
            },
        });

        // Deduct credit
        await prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 1 } },
        });

        return analysis.id;
    } catch (error) {
        console.error("Analysis failed:", error);
        throw new Error("Failed to analyze video — check URL or try again later");
    }
}

export async function getVideoReports() {
    const user = await getUser();
    if (!user) return [];

    return await prisma.videoReport.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getHistory() {
    const user = await getUser();
    if (!user) return [];

    return await prisma.analysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });
}
