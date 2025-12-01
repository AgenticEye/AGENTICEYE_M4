'use client';

import GlassCard from "@/components/GlassCard";
import { FileText, Play, Lock } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="max-w-6xl mx-auto py-12">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Video Reports</h1>
                    <p className="text-white/50">Generate full scripts and production plans from your analysis.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <GlassCard key={i} className="group relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Lock className="w-8 h-8 text-white/50 mb-4" />
                            <p className="text-white font-bold mb-4">Upgrade to Unlock Reports</p>
                            <a href="/upgrade" className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform">
                                View Plans
                            </a>
                        </div>

                        <div className="flex items-start justify-between mb-4 blur-[2px] group-hover:blur-sm transition-all">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white/50" />
                            </div>
                            <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">
                                Script Generator
                            </span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 blur-[2px] group-hover:blur-sm">Viral Video Concept #{i}</h3>
                        <p className="text-sm text-white/50 mb-6 blur-[2px] group-hover:blur-sm">
                            Generated script based on high-performing hooks and pacing analysis...
                        </p>

                        <div className="flex gap-2 blur-[2px] group-hover:blur-sm">
                            <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                            <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
