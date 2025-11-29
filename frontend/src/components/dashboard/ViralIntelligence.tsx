import { Zap, Lock } from 'lucide-react';
import ViralScoreGauge from './ViralScoreGauge';
import { motion } from 'framer-motion';

export default function ViralIntelligence({ result, tier }: { result: any, tier: string }) {
    const viralScore = result?.m3_generation?.viral_prediction_engine?.score || 0;
    const reasons = result?.m3_generation?.viral_prediction_engine?.reasons || [];
    const keywords = result?.m3_generation?.seo_keyword_generator?.primary_keywords || [];

    const isFree = tier === 'Free';
    const isDiamond = tier === 'Diamond';

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> Viral Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Viral Score Card */}
                <div className="relative">
                    <div className={`bg-[#0f172a] p-6 rounded-2xl border border-gray-800 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group ${isFree ? 'blur-sm select-none' : ''}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                        <div className="relative z-10">
                            <ViralScoreGauge score={viralScore} />
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-4">Viral Potential</p>
                    </div>

                    {isFree && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/20 rounded-2xl">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shadow-xl">
                                <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                                <p className="text-white font-bold text-sm mb-2">Viral Score Locked</p>
                                <button onClick={() => window.location.href = '/pricing'} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                                    Upgrade to Unlock
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Viral Signals */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Viral Signals</h3>
                    <ul className="space-y-3">
                        {reasons.slice(0, isDiamond ? 1 : reasons.length).map((reason: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                                {reason}
                            </li>
                        ))}
                        {isDiamond && reasons.length > 1 && (
                            <li className="text-xs text-gray-400 italic pl-3 border-l-2 border-gray-100">
                                + {reasons.length - 1} more reasons hidden (Upgrade to Solitaire)
                            </li>
                        )}
                        {reasons.length === 0 && <li className="text-sm text-gray-400 italic">No specific signals detected.</li>}
                    </ul>
                </div>

                {/* Keyword Booster */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Keyword Booster</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                                #{keyword}
                            </span>
                        ))}
                        {keywords.length === 0 && <span className="text-sm text-gray-400 italic">No keywords generated.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

