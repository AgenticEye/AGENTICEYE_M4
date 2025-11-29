import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0f0c29] text-white flex flex-col items-center py-20 px-4">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-4">
                    <span className="text-white">Simple Pricing.</span> <span className="text-gradient">Viral Results.</span>
                </h1>
                <p className="text-xl text-gray-400">Choose the plan that fits your content empire.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
                {/* Free Plan */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">Free Tier</h3>
                    <p className="text-sm text-gray-400 mb-4">Spark Your Content Strategy</p>
                    <div className="text-4xl font-black mb-6">$0<span className="text-lg text-gray-500 font-normal"> FREE</span></div>

                    <ul className="mt-2 space-y-4 mb-8 flex-grow text-left">
                        <li className="flex items-center gap-3 text-gray-300">✓ 10 Ideas to get you started</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ 3 Credits per user</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ Access to 1 Previous History</li>
                        <li className="flex items-center gap-3 text-gray-500">✕ No Viral Scores</li>
                        <li className="flex items-center gap-3 text-gray-500">✕ NO Video Generations</li>
                    </ul>

                    <Link href="/api/auth/register" className="block w-full py-3 rounded-xl border border-white/20 text-center font-bold hover:bg-white/10 transition-all">
                        Start Free
                    </Link>
                </div>

                {/* Diamond Plan (Highlighted) */}
                <div className="relative glass-card p-8 rounded-3xl border-2 border-pink-500 transform scale-105 shadow-[0_0_40px_rgba(255,0,153,0.3)] flex flex-col">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Most Popular
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-cyan-400">Diamond Tier</h3>
                    <p className="text-sm text-gray-400 mb-4">Spark Your Content Strategy</p>
                    <div className="text-4xl font-black mb-2">$20<span className="text-lg text-gray-500 font-normal"> / month</span></div>
                    <p className="text-xs text-gray-500 mb-6">Billed annually ($240/Year)</p>

                    <ul className="mt-2 space-y-4 mb-8 flex-grow text-left">
                        <li className="flex items-center gap-3 text-white">✓ 20 Ideas to get you started</li>
                        <li className="flex items-center gap-3 text-white">✓ 100 Credits/month or 1750 Credits/year</li>
                        <li className="flex items-center gap-3 text-white">✓ Half Access to History and Viral Scores</li>
                        <li className="flex items-center gap-3 text-white">✓ Medium-level AI Agents</li>
                        <li className="flex items-center gap-3 text-white">✓ x3 FREE Video Generations a Month</li>
                        <li className="flex items-center gap-3 text-gray-500">✕ No AI Content Ideas Reports</li>
                    </ul>

                    <Link href="/api/auth/register" className="block w-full py-3 rounded-xl bg-gradient-primary text-center font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all">
                        Upgrade Now
                    </Link>
                </div>

                {/* Solitaire Plan */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 text-purple-400">Solitaire Tier</h3>
                    <p className="text-sm text-gray-400 mb-4">Spark Your Content Strategy</p>
                    <div className="text-4xl font-black mb-2">$30<span className="text-lg text-gray-500 font-normal"> / month</span></div>
                    <p className="text-xs text-gray-500 mb-6">Billed annually ($360/Year)</p>

                    <ul className="mt-2 space-y-4 mb-8 flex-grow text-left">
                        <li className="flex items-center gap-3 text-gray-300">✓ 30 Ideas to get you started</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ 200 Credits/month or 3000 Credits/year</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ Full Access to History and Viral Scores</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ High-level AI Agents and Report generation</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ x5 FREE Video Generations a Month</li>
                        <li className="flex items-center gap-3 text-gray-300">✓ Priority support</li>
                    </ul>

                    <Link href="/api/auth/register" className="block w-full py-3 rounded-xl border border-white/20 text-center font-bold hover:bg-white/10 transition-all">
                        Go Solitaire
                    </Link>
                </div>
            </div>
        </div>
    );
}
