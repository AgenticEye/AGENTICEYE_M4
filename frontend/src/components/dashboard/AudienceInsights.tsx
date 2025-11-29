import { User } from 'lucide-react';
import EngagementHeatmap from './EngagementHeatmap';

interface AudienceInsightsProps {
    result: any;
}

export default function AudienceInsights({ result }: AudienceInsightsProps) {
    const sentiment = result?.m2_analysis?.sentiment?.positive || 0;
    const questions = result?.m2_analysis?.questions || [];
    const topics = result?.m2_analysis?.topics || [];

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" /> Audience Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Sentiment */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 w-full text-left">Sentiment</h3>
                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-8 border-green-100 border-t-green-500">
                        <div className="text-center">
                            <div className="text-2xl font-black text-green-600">{sentiment}%</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold">Positive</div>
                        </div>
                    </div>
                </div>
                {/* Questions */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm col-span-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Top Audience Questions</h3>
                    <ul className="space-y-3">
                        {questions.slice(0, 3).map((q: any, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                <span className="text-purple-500 font-bold text-lg leading-none">?</span>
                                <span className="line-clamp-2">{q.text}</span>
                            </li>
                        ))}
                        {questions.length === 0 && <li className="text-sm text-gray-400 italic">No questions detected.</li>}
                    </ul>
                </div>
                {/* Topics */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trending Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {topics.slice(0, 6).map((t: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                                {t.topic}
                            </span>
                        ))}
                        {topics.length === 0 && <span className="text-sm text-gray-400 italic">No topics detected.</span>}
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <EngagementHeatmap />
            </div>
        </section>
    );
}
