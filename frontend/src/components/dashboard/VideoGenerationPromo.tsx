import { Video } from 'lucide-react';

interface VideoGenerationPromoProps {
    tier: string;
    videoCredits: number;
    onGenerateClick: () => void;
}

export default function VideoGenerationPromo({ tier, videoCredits, onGenerateClick }: VideoGenerationPromoProps) {
    return (
        <section className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to create?</h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Turn these insights into a viral video instantly. Our AI will generate the script, voiceover, and visuals for you.
                    {tier !== 'Free' && <span className="text-green-400 font-bold block mt-2">You have {videoCredits} free generations left.</span>}
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-[#1a1a2e]"></div>
                        <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-[#1a1a2e]"></div>
                        <div className="w-10 h-10 rounded-full bg-cyan-500 border-2 border-[#1a1a2e]"></div>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Join 10,000+ creators</span>
                </div>
            </div>
            <div className="relative z-10 mt-8 md:mt-0">
                <button
                    onClick={onGenerateClick}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 transition-all flex items-center gap-3 text-lg"
                >
                    <Video className="w-6 h-6" /> Generate Video
                </button>
            </div>
        </section>
    );
}
