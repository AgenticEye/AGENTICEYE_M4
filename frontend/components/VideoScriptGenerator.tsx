"use client";

import { useState } from "react";
import { Video, Loader2, Check, Lock, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function VideoScriptGenerator({ hook, title, isPremium, credits }: { hook: string, title: string, isPremium: boolean, credits: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [duration, setDuration] = useState("60s");
    const router = useRouter();

    const handleGenerate = async () => {
        setLoading(true);
        setProgress(0);
        setStatus("Initializing AI...");

        // Simulate progress (slower now, up to 45s)
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 95) return p;
                return p + (Math.random() * 2); // Slower increments
            });
        }, 800);

        try {
            setStatus("Generating viral script...");
            const res = await fetch("/api/generate-video-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hook, title, duration }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            clearInterval(interval);
            setProgress(100);
            setStatus("Script ready!");

            await new Promise(r => setTimeout(r, 800)); // Show 100% briefly
            setIsOpen(false);
            router.push("/video-reports");
        } catch (error: any) {
            clearInterval(interval);
            setStatus("Error occurred");
            alert(error.message);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    if (!isPremium) {
        return (
            <button disabled className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 flex items-center justify-center gap-2 cursor-not-allowed">
                <Lock className="w-4 h-4" /> Generate Video Script (Premium)
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
            >
                <Video className="w-4 h-4" /> Generate Video Script (1 Credit)
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Generate Script</h3>
                                <button onClick={() => !loading && setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full disabled:opacity-50" disabled={loading}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="text-sm text-white/60">Select Duration</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {["60s", "90s", "120s"].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            disabled={loading}
                                            className={`py-2 rounded-lg border text-sm font-bold transition-all ${duration === d ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl mb-6 text-sm text-white/70">
                                <div className="flex justify-between mb-1">
                                    <span>Cost</span>
                                    <span className="text-white font-bold">1 Credit</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Credits Remaining</span>
                                    <span className={credits < 1 ? "text-red-400" : "text-green-400"}>{credits}</span>
                                </div>
                            </div>

                            {loading && (
                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between text-xs text-white/50">
                                        <span>{status}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || credits < 1}
                                className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        <span>Generating... (10-45s)</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>Generate Now</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
