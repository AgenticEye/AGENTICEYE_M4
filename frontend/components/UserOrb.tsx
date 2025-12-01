'use client';

import { motion } from 'framer-motion';
import { Zap, Crown, Video } from 'lucide-react';
import Link from 'next/link';

export default function UserOrb({ credits, videoCredits = 0, tier = 'Free' }: { credits: number, videoCredits?: number, tier?: string }) {
    // Fallback: If credits > 150, assume Solitaire (visual fix for caching issues)
    const effectiveTier = (tier === 'Solitaire' || credits > 150) ? 'Solitaire' : tier;
    const isPremium = effectiveTier !== 'Free';
    const tierColor = effectiveTier === 'Solitaire' ? 'text-purple-400' : effectiveTier === 'Diamond' ? 'text-teal-400' : 'text-white/50';

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-4"
        >
            <Link href="/upgrade">
                <div className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${effectiveTier === 'Solitaire' ? 'from-purple-600 to-yellow-600' : effectiveTier === 'Diamond' ? 'from-teal-500 to-blue-500' : 'from-purple-600 to-blue-600'} rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500`} />
                    <div className="relative flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 hover:border-white/30 transition-colors cursor-pointer">
                        <div className="flex flex-col items-end">
                            <span className={`text-xs font-medium uppercase tracking-wider ${tierColor}`}>{effectiveTier} Tier</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-white flex items-center gap-1">
                                    {credits} <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                </span>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${effectiveTier === 'Solitaire' ? 'from-purple-900 to-yellow-900' : effectiveTier === 'Diamond' ? 'from-teal-900 to-blue-900' : 'from-gray-700 to-gray-900'} border border-white/20 flex items-center justify-center shadow-inner`}>
                            <Crown className={`w-5 h-5 ${isPremium ? 'text-yellow-400' : 'text-white/50'} transition-colors`} />
                        </div>
                    </div>

                    {/* Hover Tooltip */}
                    <div className="absolute top-full right-0 mt-4 w-64 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
                        <div className="text-center space-y-3">
                            {isPremium ? (
                                <>
                                    <div className="flex justify-between items-center text-sm text-white/80">
                                        <span>Video Credits</span>
                                        <span className="font-bold text-white flex items-center gap-1">
                                            {videoCredits} <Video className="w-3 h-3 text-purple-400" />
                                        </span>
                                    </div>
                                    <div className="w-full py-2 rounded-lg bg-white/10 text-xs font-bold uppercase tracking-wider text-green-400">
                                        Active
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-white/80">Running low on credits?</p>
                                    <div className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold uppercase tracking-wider">
                                        Upgrade for 100+ Credits
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
