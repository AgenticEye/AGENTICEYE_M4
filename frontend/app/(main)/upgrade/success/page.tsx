'use client';

import GlassCard from "@/components/GlassCard";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function SuccessPage() {
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <GlassCard className="p-12 text-center max-w-lg">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Upgrade Successful!</h1>
                <p className="text-white/60 mb-8">
                    Welcome to the elite circle. Your credits have been added and all premium features are now unlocked.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
            </GlassCard>
        </div>
    );
}
