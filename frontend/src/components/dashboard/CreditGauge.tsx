'use client';

import { motion } from 'framer-motion';

interface CreditGaugeProps {
    current: number;
    max: number;
    label?: string;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}

export default function CreditGauge({
    current,
    max,
    label = "Credits",
    size = 100,
    strokeWidth = 8,
    showLabel = true
}: CreditGaugeProps) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const center = size / 2;

    let color = 'text-green-500';
    if (percentage < 50) color = 'text-yellow-500';
    if (percentage < 20) color = 'text-red-500';

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-gray-100"
                    />
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1 }}
                        strokeLinecap="round"
                        className={color}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-gray-900">
                    <span className="text-4xl font-bold">{current}</span>
                    <span className="text-sm text-gray-400 font-medium">/ {max}</span>
                </div>
            </div>
            {showLabel && (
                <div className="mt-2 text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</div>
            )}
        </div>
    );
}
