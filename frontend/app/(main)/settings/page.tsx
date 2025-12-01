'use client';

import GlassCard from "@/components/GlassCard";
import { User, Bell, Download, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" /> Profile
                    </h2>
                    <GlassCard className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/50">Display Name</label>
                                <input type="text" placeholder="Your Name" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/50">Email</label>
                                <input type="email" value="user@example.com" disabled className="w-full bg-black/30 border border-white/5 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/50">Content Niche</label>
                            <select className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                                <option>Select your niche...</option>
                                <option>Gaming</option>
                                <option>Tech & AI</option>
                                <option>Beauty & Fashion</option>
                                <option>Education</option>
                                <option>Entertainment</option>
                            </select>
                        </div>
                    </GlassCard>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-400" /> Notifications
                    </h2>
                    <GlassCard className="p-8">
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-white/80">Email me when analysis is complete</span>
                                <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-purple-500 transition-colors" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-white/80">Weekly viral trend report</span>
                                <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-purple-500 transition-colors" />
                            </label>
                        </div>
                    </GlassCard>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-green-400" /> Data & Privacy
                    </h2>
                    <GlassCard className="p-8">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div>
                                <h3 className="font-medium mb-1">Export Data</h3>
                                <p className="text-sm text-white/50">Download all your analysis history in JSON format.</p>
                            </div>
                            <button className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                                Export All
                            </button>
                        </div>

                        <div className="h-px bg-white/10 my-6" />

                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div>
                                <h3 className="font-medium mb-1 text-red-400">Delete Account</h3>
                                <p className="text-sm text-white/50">Permanently remove all your data and credits.</p>
                            </div>
                            <button className="px-6 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Delete Account
                            </button>
                        </div>
                    </GlassCard>
                </section>

                <div className="flex justify-end">
                    <button className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
