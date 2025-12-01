'use client';

import { Download } from 'lucide-react';

export default function ExportButton({ isSolitaire }: { isSolitaire: boolean }) {
    const handleExport = () => {
        window.print();
    };

    return (
        <button
            onClick={handleExport}
            disabled={!isSolitaire}
            className={`flex-1 py-4 rounded-xl border transition-colors flex items-center justify-center gap-2 font-bold ${!isSolitaire ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
            <Download className="w-5 h-5" /> {isSolitaire ? 'Export PDF (No Watermark)' : 'Export (Solitaire Only)'}
        </button>
    );
}
