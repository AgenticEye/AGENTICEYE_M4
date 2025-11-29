'use client';

import { motion } from 'framer-motion';

export default function EngagementHeatmap() {
    // Mock data for 24 hours
    // 0 = Low, 1 = Medium, 2 = High, 3 = Viral
    const hours = Array.from({ length: 24 }, (_, i) => {
        // Simulate a peak around 6pm-9pm (18-21)
        if (i >= 18 && i <= 21) return 3;
        if (i >= 12 && i < 18) return 2;
        if (i >= 8 && i < 12) return 1;
        return 0;
    });

    const getColor = (intensity: number) => {
        switch (intensity) {
            case 3: return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
            case 2: return 'bg-orange-400';
            case 1: return 'bg-yellow-300';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <h4 className="text-sm font-bold text-gray-700">Engagement Heatmap (24h)</h4>
                <div className="flex gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-100 rounded-sm"></div> Low</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> Viral</span>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-1">
                {hours.map((intensity, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={`h-8 rounded-md flex items-center justify-center text-[10px] font-medium text-white/80 ${getColor(intensity)}`}
                        title={`${i}:00 - Intensity: ${intensity}`}
                    >
                        {intensity >= 2 && '🔥'}
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
            </div>
        </div>
    );
}
