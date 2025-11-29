'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Zap, BarChart3, Lock, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
    const [typedUrl, setTypedUrl] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Simulate typing effect for demo
    useEffect(() => {
        const demoUrl = "https://youtube.com/watch?v=dQw4w9WgXcQ";
        let i = 0;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setTypedUrl(demoUrl.slice(0, i));
                i++;
                if (i > demoUrl.length) {
                    clearInterval(interval);
                    setShowPreview(true);
                }
            }, 50);
            return () => clearInterval(interval);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-5xl w-full flex flex-col items-center"
            >
                <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-8 text-cyan-300 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Viral Content Engine
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-tight">
                    <span className="text-white">Predict. Create.</span><br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x">Go Viral.</span>
                </h1>

                <p className="text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
                    Paste any video link. Our AI analyzes comments, sentiment, and trends to generate
                    <span className="text-cyan-400 font-bold"> guaranteed viral scripts</span> and hooks.
                </p>

                {/* Interactive Demo Input */}
                <div className="w-full max-w-4xl relative group flex flex-col md:flex-row items-center gap-8">

                    {/* Input Box */}
                    <div className="relative w-full flex-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                        <div className="relative flex items-center bg-[#0f111a] rounded-xl p-2 border border-white/10 shadow-2xl">
                            <div className="pl-4 text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={typedUrl}
                                    readOnly
                                    placeholder="Paste YouTube or TikTok link..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-4 text-lg placeholder-gray-600 font-mono"
                                />
                                {/* Scanning Animation */}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-400"
                                    initial={{ width: "0%" }}
                                    animate={{ width: typedUrl.length > 0 ? "100%" : "0%" }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                            <Link href="/api/auth/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-bold shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_40px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2 whitespace-nowrap"
                                >
                                    Analyze Now <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <AnimatePresence>
                        {showPreview && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="hidden md:block w-80 bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-left shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Analysis Live</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400">Viral Score</span>
                                        <span className="text-sm font-bold text-green-400">92/100</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "92%" }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                                        />
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-300">
                                            <Zap className="w-3 h-3 text-yellow-400" />
                                            <span>High Engagement Detected</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-300">
                                            <BarChart3 className="w-3 h-3 text-purple-400" />
                                            <span>Trending Topic: AI Tools</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Trust Badges / Micro-copy */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-8 flex items-center gap-6 text-sm text-gray-500"
                >
                    <span>🚀 Used by 10,000+ Creators</span>
                    <span>•</span>
                    <span>🔥 1M+ Ideas Generated</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
