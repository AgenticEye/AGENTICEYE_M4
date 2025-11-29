'use client';

import { motion } from 'framer-motion';

export default function ViralScoreGauge({ score }: { score: number }) {
    // Calculate rotation: 0 to 180 degrees
    // Score 0 = -90deg, Score 100 = 90deg
    const rotation = (score / 100) * 180 - 90;

    const getColor = (s: number) => {
        if (s >= 90) return '#9333ea'; // Purple
        if (s >= 75) return '#16a34a'; // Green
        if (s >= 50) return '#eab308'; // Yellow
        return '#dc2626'; // Red
    };

    const color = getColor(score);

    return (
        <div className="relative w-64 h-32 mx-auto overflow-hidden">
            {/* Background Arc */}
            <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[20px] border-gray-100 box-border"></div>

            {/* Colored Arc (Simplified as a gradient background for now or just rely on needle) */}
            {/* For a true gauge, we'd need SVG paths. Let's use a cleaner CSS approach */}

            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 100">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="75%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                </defs>
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="20"
                    strokeLinecap="round"
                />
            </svg>

            {/* Needle */}
            <motion.div
                className="absolute bottom-0 left-1/2 w-1 h-24 bg-white origin-bottom rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                initial={{ rotate: -90 }}
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 50, damping: 10 }}
                style={{ zIndex: 10 }}
            >
                <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </motion.div>

            {/* Center Hub */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full border-2 border-gray-700 z-20"></div>

            {/* Score Text */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-8 text-center">
                <div className="text-3xl font-black" style={{ color }}>{score}</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Viral Score</div>
            </div>
        </div>
    );
}
