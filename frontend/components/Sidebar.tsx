'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, FileVideo, Zap, Settings, LogOut, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: History, label: 'History', href: '/history' },
    { icon: FileVideo, label: 'Video Reports', href: '/video-reports' },
    { icon: Zap, label: 'Upgrade', href: '/upgrade', highlight: true },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
        >
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">Agentic Eye</span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                } ${item.highlight ? 'text-yellow-400 hover:text-yellow-300' : ''}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/5"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <item.icon className={`w-5 h-5 ${item.highlight ? 'text-yellow-400' : ''}`} />
                            <span className="font-medium relative z-10">{item.label}</span>
                            {item.highlight && (
                                <div className="absolute right-2 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <a
                    href="/api/auth/logout"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </a>
            </div>
        </motion.div>
    );
}
