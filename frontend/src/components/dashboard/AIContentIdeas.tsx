import { Zap, Video, Crown } from 'lucide-react';

interface AIContentIdeasProps {
    result: any;
    tier: string;
    onOrderVideo: (title: string, notes: string) => void;
}

export default function AIContentIdeas({ result, tier, onOrderVideo }: AIContentIdeasProps) {
    const ideas = result?.m3_generation?.ai_recommendations?.next_best_content || [];

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" /> AI Content Ideas
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 bg-gray-50 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <div className="col-span-1 text-center">No.</div>
                    <div className="col-span-8">Content Blueprint</div>
                    <div className="col-span-3 text-center">Actions</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {ideas.map((item: any, i: number) => {
                        const isLocked = tier === 'Free' && i > 0;
                        const title = typeof item === 'string' ? item : item.title;
                        const score = typeof item === 'string' ? (result?.m3_generation?.viral_prediction_engine?.score || 0) : item.score;
                        const blueprint = item.blueprint;

                        return (
                            <div key={i} className={`grid grid-cols-12 p-6 items-start relative ${isLocked ? 'bg-gray-50' : 'bg-white hover:bg-gray-50 transition-colors'}`}>
                                <div className="col-span-1 text-center text-gray-400 font-bold pt-1">{i + 1}</div>
                                <div className={`col-span-8 text-gray-900 ${isLocked ? 'blur-sm select-none' : ''}`}>
                                    <div className="font-bold text-lg mb-3">{title}</div>
                                    {blueprint && !isLocked && (
                                        <div className="text-sm space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                            <div>
                                                <span className="font-bold text-purple-600 text-xs uppercase tracking-wider">🪝 Viral Hooks</span>
                                                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 pl-2">
                                                    {blueprint.hooks?.map((h: string, idx: number) => <li key={idx}>{h}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <span className="font-bold text-purple-600 text-xs uppercase tracking-wider">📜 Mini Script</span>
                                                <p className="text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">{blueprint.script_mini}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">🎙️ Voiceover</span>
                                                    <p className="text-gray-600 mt-1">{blueprint.voiceover?.tone} ({blueprint.voiceover?.gender})</p>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">🎬 Direction</span>
                                                    <p className="text-gray-600 text-xs mt-1">{blueprint.scene_directions?.[0]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 flex flex-col items-center gap-3">
                                    {isLocked ? (
                                        <span className="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full">LOCKED</span>
                                    ) : (
                                        <>
                                            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 ${score >= 90 ? 'border-green-500 text-green-600' : score >= 80 ? 'border-green-400 text-green-500' : 'border-yellow-400 text-yellow-500'}`}>
                                                <span className="text-lg font-black">{score}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const notes = `Script: ${blueprint?.script_mini}\n\nHooks: ${blueprint?.hooks?.join(', ')}\n\nVoiceover: ${blueprint?.voiceover?.tone}`;
                                                    onOrderVideo(title, notes);
                                                }}
                                                className="w-full py-2.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                            >
                                                <Video className="w-3 h-3" /> Order Video
                                            </button>
                                        </>
                                    )}
                                </div>

                                {isLocked && i === 1 && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-[2px]">
                                        <button
                                            onClick={() => window.location.href = '/pricing'}
                                            className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Crown className="w-4 h-4" /> Upgrade to Unlock All Ideas
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {ideas.length === 0 && <div className="p-8 text-center text-gray-500">No content ideas generated.</div>}
                </div>
            </div>
        </section>
    );
}
