"use client";

import { useState } from "react";
import { FileText, Copy, Download, Check } from "lucide-react";
import GlassCard from "@/components/GlassCard";

interface VideoReport {
    id: string;
    title: string;
    script: string;
    duration: string;
    createdAt: Date;
}

export default function VideoReportCard({ report }: { report: VideoReport }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(report.script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const blob = new Blob([report.script], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_script.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <GlassCard className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs text-white/40 font-mono">
                    {new Date(report.createdAt).toLocaleDateString()}
                </span>
            </div>

            <h3 className="font-bold text-lg mb-2 line-clamp-2">{report.title}</h3>
            <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
                <span className="px-2 py-1 bg-white/5 rounded uppercase tracking-wider">{report.duration}</span>
                <span>• AI Generated</span>
            </div>

            <div className="mt-auto flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                </button>
                <button
                    onClick={handleExport}
                    className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>
        </GlassCard>
    );
}
