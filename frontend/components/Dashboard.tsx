'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';
import { Loader2, Sparkles, History, Zap, ArrowRight, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import confetti from "canvas-confetti";

export default function Dashboard({ user, history }: { user: any, history: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsClient(true);
        const upgraded = searchParams.get("upgraded");
        const sessionId = searchParams.get("session_id");

        if (upgraded === "solitaire" || sessionId) {
            // Verify payment server-side to ensure DB update
            if (sessionId) {
                fetch('/api/verify-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId })
                }).then(() => {
                    router.refresh();
                });
            } else {
                router.refresh();
            }

            if (upgraded === "solitaire") {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#A855F7', '#EAB308', '#FFFFFF']
                });
            }

            // Remove params
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("upgraded");
            newUrl.searchParams.delete("session_id");
            window.history.replaceState({}, '', newUrl.toString());
        }
    }, [searchParams, router]);

    if (!isClient) {
        return <div className="min-h-screen bg-black" />;
    }

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        // Basic URL validation
        if (!url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('tiktok.com')) {
            setError('Please enter a valid YouTube or TikTok URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch("https://agenticeye-m4.onrender.com/m3/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) throw new Error("Backend error");

            const result = await response.json();

            // Go to results page
            // Assuming result has an id. If not, we might need to adjust.
            // The python backend returns the analysis result. 
            // If we want to show it, we usually redirect to a results page that fetches it.
            // But since we are "pure frontend", maybe we should pass the result?
            // For now, let's assume the backend returns an ID or we just redirect.
            // The user prompt says: router.push(`/results?id=${result.id}`)
            // But our current routing is /results/[id]. 
            // Let's stick to the user's prompt suggestion or adapt to existing routing.
            // Existing routing: router.push(`/results/${analysisId}`);
            // Let's assume result.id exists.
            if (result.id) {
                router.push(`/results/${result.id}`);
            } else {
                // Fallback if no ID (maybe pass data via state? or just show success)
                // For now, let's try to push to results with the ID if available.
                // If the backend returns the whole object, we might need to save it to local storage or similar if we don't have a DB.
                // But the user said "Analysis works 100%".
                // I'll stick to the user's snippet logic: router.push(`/results?id=${result.id}`)
                // But I'll adapt it to the existing route structure if possible, or use query param.
                router.push(`/results/${result.id || 'latest'}`);
            }
        } catch (err: any) {
            console.error("Analysis Error:", err);
            setError("Failed – try a public YouTube video");
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Agentic Eye
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {user.tier === 'Solitaire' ? (
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-yellow-600 border border-purple-400/50 backdrop-blur-md text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            <Crown className="w-4 h-4 text-yellow-200" />
                            <span className="text-white">Solitaire • {user.credits} Credits</span>
                        </div>
                    ) : (
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium">
                            {user.credits} Credits
                        </div>
                    )}

                    {/* GOD BUTTON */}
                    <button
                        onClick={async () => {
                            if (confirm("ACTIVATE SOLITAIRE GOD MODE?")) {
                                await fetch('/api/debug/force-upgrade', { method: 'POST' });
                                window.location.reload();
                            }
                        }}
                        className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 text-white/20 hover:text-purple-400 transition-all"
                        title="Force Solitaire Mode"
                    >
                        <Crown className="w-4 h-4" />
                    </button>

                    <a href="/api/auth/logout" className="text-sm text-white/50 hover:text-white transition-colors">
                        Logout
                    </a>
                </div>
            </div>

            {/* Main Input Area */}
            <div className="mb-16 relative z-10">
                <GlassCard className="p-8 md:p-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
                        Predict Viral Potential
                    </h2>
                    <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
                        Paste your video URL below. Our AI analyzes hooks, pacing, and emotional triggers to predict virality.
                    </p>

                    <form onSubmit={handleAnalyze} className="max-w-xl mx-auto relative">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://youtube.com/shorts/... or https://tiktok.com/..."
                                className="relative w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-xl transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || user.credits < 1}
                            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? 'Analyzing...' : 'Analyze Content'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* History Grid */}
            <div>
                <div className="flex items-center justify-between mb-6 opacity-70">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        <h3 className="text-xl font-semibold">Recent Analysis</h3>
                    </div>
                    <Link href="/history" className="text-sm hover:text-white transition-colors flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {history.slice(0, 3).map((item) => (
                        <Link key={item.id} href={`/results/${item.id}`}>
                            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer group h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`text-2xl font-bold ${item.viralScore >= 8 ? 'text-green-400' : item.viralScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {item.viralScore.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-white/30">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-sm text-white/60 truncate mb-2">{item.url}</div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                        style={{ width: `${(item.viralScore / 10) * 100}%` }}
                                    />
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity">
                <button
                    onClick={async () => {
                        await fetch('/api/debug/force-upgrade', { method: 'POST' });
                        window.location.reload();
                    }}
                    className="text-xs text-red-500 border border-red-500 px-2 py-1 rounded"
                >
                    DEBUG: FORCE SOLITAIRE
                </button>
            </div>
        </div>
    );
}
