'use client';

import GlassCard from "@/components/GlassCard";
import { Check, X, Zap, Star, Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
    const [annual, setAnnual] = useState(false);
    const router = useRouter();

    const features = [
        { name: "Monthly Credits", free: "3", diamond: "100", solitaire: "200" },
        { name: "Content Ideas per Analyse", free: "3", diamond: "5", solitaire: "7" },
        { name: "Full Sentiment Analysis", free: "Basic", diamond: "Full + Emotions", solitaire: "Advanced + Trends" },
        { name: "Viral Score", free: "Hidden", diamond: "Yes", solitaire: "Yes + Breakdown" },
        { name: "Video Script + Hooks", free: "No", diamond: "Yes", solitaire: "Yes + Pro Hooks" },
        { name: "Competitor Analysis", free: "No", diamond: "No", solitaire: "Yes (5 rivals)" },
        { name: "History Saved", free: "3", diamond: "50", solitaire: "Unlimited" },
        { name: "Export PDF", free: "No", diamond: "No", solitaire: "Yes + No Watermark" },
    ];

    const handleUpgrade = async (tier: string) => {
        try {
            const res = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier, annual }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Unlock Full Potential
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    Choose the plan that fits your growth. Upgrade anytime.
                </p>

                <div className="flex items-center justify-center gap-4 mt-8">
                    <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-white/50'}`}>Monthly</span>
                    <button
                        onClick={() => setAnnual(!annual)}
                        className="w-14 h-8 rounded-full bg-white/10 relative transition-colors hover:bg-white/20"
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${annual ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-white/50'}`}>
                        Annual <span className="text-green-400 text-xs ml-1">(Save 20%)</span>
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* FREE PLAN */}
                <GlassCard className="p-0 overflow-hidden flex flex-col border-white/5">
                    <div className="p-8 border-b border-white/5 bg-white/5">
                        <h3 className="text-xl font-bold mb-2 text-white/70">Free</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-white/50">/mo</span>
                        </div>
                        <button disabled className="w-full mt-6 py-3 rounded-xl bg-white/5 text-white/30 font-bold cursor-not-allowed">
                            Current Plan
                        </button>
                    </div>
                    <div className="p-6 flex-1 bg-black/20">
                        <ul className="space-y-4 text-sm">
                            {features.map((f, i) => (
                                <li key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/60">{f.name}</span>
                                    <span className={`font-medium ${f.free === "No" || f.free === "Hidden" ? "text-red-400" : "text-white"}`}>
                                        {f.free === "No" ? <X className="w-4 h-4" /> : f.free}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </GlassCard>

                {/* DIAMOND PLAN */}
                <GlassCard className="p-0 overflow-hidden flex flex-col border-teal-500/30 relative ring-1 ring-teal-500/20 shadow-[0_0_40px_rgba(20,184,166,0.1)]">
                    <div className="absolute top-0 right-0 bg-teal-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                        MOST POPULAR
                    </div>
                    <div className="p-8 border-b border-white/5 bg-gradient-to-b from-teal-900/40 to-black/40">
                        <h3 className="text-xl font-bold mb-2 text-teal-400 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Diamond
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">${annual ? 29 : 39}</span>
                            <span className="text-white/50">/mo</span>
                        </div>
                        <button
                            onClick={() => handleUpgrade("Diamond")}
                            className="w-full mt-6 py-3 rounded-xl bg-teal-500 text-black font-bold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
                        >
                            Choose Diamond
                        </button>
                    </div>
                    <div className="p-6 flex-1 bg-teal-900/10">
                        <ul className="space-y-4 text-sm">
                            {features.map((f, i) => (
                                <li key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/80">{f.name}</span>
                                    <span className={`font-bold ${f.diamond === "No" ? "text-red-400" : "text-teal-200"}`}>
                                        {f.diamond === "No" ? <X className="w-4 h-4" /> : (f.diamond === "Yes" ? <Check className="w-4 h-4" /> : f.diamond)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </GlassCard>

                {/* SOLITAIRE PLAN */}
                <GlassCard className="p-0 overflow-hidden flex flex-col border-purple-500/50 relative ring-1 ring-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-b from-purple-900/40 to-black/40">
                        <h3 className="text-xl font-bold mb-2 text-purple-400 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-400" /> Solitaire
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">${annual ? 79 : 99}</span>
                            <span className="text-white/50">/mo</span>
                        </div>
                        <button
                            onClick={() => handleUpgrade("Solitaire")}
                            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-yellow-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                        >
                            Choose Solitaire
                        </button>
                    </div>
                    <div className="p-6 flex-1 bg-purple-900/10">
                        <ul className="space-y-4 text-sm">
                            {features.map((f, i) => (
                                <li key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/90">{f.name}</span>
                                    <span className="font-bold text-yellow-200 text-right">
                                        {f.solitaire === "Yes" ? <Check className="w-4 h-4 ml-auto" /> : f.solitaire}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </GlassCard>
            </div>
            <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity">
                <button
                    onClick={async () => {
                        await fetch('/api/debug/force-upgrade', { method: 'POST' });
                        window.location.href = '/dashboard';
                    }}
                    className="text-xs text-red-500 border border-red-500 px-2 py-1 rounded"
                >
                    DEBUG: FORCE SOLITAIRE
                </button>
            </div>
        </div>
    );
}
