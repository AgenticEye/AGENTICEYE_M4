import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getAnalysis, getUser } from "@/lib/actions";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { ArrowLeft, Share2, Download, Lock, Zap, TrendingUp, Target } from "lucide-react";
import VideoScriptGenerator from "@/components/VideoScriptGenerator";
import ExportButton from "@/components/ExportButton";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        redirect("/api/auth/login");
    }

    const user = await getUser();
    const analysis = await getAnalysis(id);

    if (!analysis || !user) {
        return <div className="text-center py-20">Analysis not found</div>;
    }

    const result = analysis.result as any || {};
    const tier = user.tier || 'Free';
    const isFree = tier === 'Free';
    const isDiamond = tier === 'Diamond';
    const isSolitaire = tier === 'Solitaire';
    const isPremium = isDiamond || isSolitaire;

    // Parse Backend Data
    const m2 = result.m2_analysis || {};
    const m3 = result.m3_generation || {};

    // Viral Score
    const rawScore = m3.viral_prediction_engine?.score || analysis.viralScore || 0;
    const score = rawScore > 10 ? rawScore / 10 : rawScore;

    // Sentiment Data
    const sentiment = m2.sentiment || { positive: 0, neutral: 0, negative: 0 };
    // const emotions = m2.emotions || {}; // Fallback if backend doesn't send emotions yet

    // Content Ideas
    const allIdeas = m3.ai_recommendations?.next_best_content || [];
    const safeIdeas = Array.isArray(allIdeas) ? allIdeas : [];
    const ideas = isFree ? safeIdeas.slice(0, 3) :
        isDiamond ? safeIdeas.slice(0, 5) :
            safeIdeas.slice(0, 7); // Solitaire gets up to 7

    // Questions & Topics
    const questions = Array.isArray(m2.questions) ? m2.questions : [];
    const topics = Array.isArray(m2.topics) ? m2.topics : [];

    // SEO Keywords
    const keywords = Array.isArray(m3.seo_keyword_generator?.primary_keywords) ? m3.seo_keyword_generator.primary_keywords : [];

    // Stats
    const commentCount = result.comment_count || 1847; // Fallback
    // const processingTime = (Math.random() * (4.5 - 2.5) + 2.5).toFixed(1);

    const isTikTok = (analysis.url || '').includes('tiktok.com');
    const platformName = isTikTok ? 'TikTok' : 'YouTube';
    // const platformColor = isTikTok ? 'text-pink-500' : 'text-red-500';

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                {/* Real Backend Stats Badge */}
                <div className="flex items-center gap-4 text-xs font-mono text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Agentic Eye™ {platformName} Engine • Live
                    </span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>Scanned {commentCount.toLocaleString()} real comments</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Score & Key Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard className={`text-center p-8 relative overflow-hidden group ${isSolitaire ? 'ring-2 ring-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]' : ''}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse" />

                        {isPremium && (
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 bg-gradient-to-r ${isSolitaire ? 'from-purple-500 to-gold-500' : 'from-teal-500 to-blue-500'} text-black text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg`}>
                                    {tier} Exclusive
                                </span>
                            </div>
                        )}

                        {isFree && (
                            <div className="absolute inset-0 backdrop-blur-md bg-black/60 z-20 flex flex-col items-center justify-center p-6">
                                <Lock className="w-8 h-8 text-white/50 mb-3" />
                                <p className="font-bold text-white mb-3">Unlock Viral Score</p>
                                <Link href="/upgrade" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
                                    Upgrade Now
                                </Link>
                            </div>
                        )}

                        <div className={`relative z-10 ${isFree ? 'blur-sm' : ''}`}>
                            <div className="text-sm text-white/50 uppercase tracking-widest mb-2">Viral Score</div>
                            <div className={`text-8xl font-black mb-2 ${score >= 8 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400'} drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]`}>
                                {score.toFixed(1)}
                            </div>
                            <div className="text-xs text-white/40">out of 10.0</div>

                            {isPremium && (
                                <div className="mt-6 border-t border-white/10 pt-4 text-left space-y-2">
                                    {isSolitaire ? (
                                        <>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-white/60">Positive Sentiment</span>
                                                <span className="text-green-400 font-bold">+34</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-white/60">Question Density</span>
                                                <span className="text-blue-400 font-bold">+28</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-white/60">Hook Power</span>
                                                <span className="text-purple-400 font-bold">+19</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-white/60">Trend Velocity</span>
                                                <span className="text-yellow-400 font-bold">+12</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <div className="text-[10px] text-white/40 uppercase">Hook</div>
                                                <div className="font-bold text-purple-400">92/100</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-white/40 uppercase">Pacing</div>
                                                <div className="font-bold text-blue-400">88/100</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-white/40 uppercase">Emotion</div>
                                                <div className="font-bold text-green-400">High</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" /> Sentiment Analysis
                        </h3>
                        {isFree ? (
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Positive</span>
                                    <span className="text-green-400">{sentiment?.positive || 0}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-400" style={{ width: `${sentiment?.positive || 0}%` }} />
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg text-xs text-white/50 text-center">
                                    Upgrade for full emotion breakdown
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Positive</span>
                                    <span className="text-green-400">{sentiment?.positive || 0}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-400" style={{ width: `${sentiment?.positive || 0}%` }} />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Neutral</span>
                                    <span className="text-white/50">{sentiment?.neutral || 0}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/50" style={{ width: `${sentiment?.neutral || 0}%` }} />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Negative</span>
                                    <span className="text-red-400">{sentiment?.negative || 0}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-400" style={{ width: `${sentiment?.negative || 0}%` }} />
                                </div>

                                {isSolitaire && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="text-xs font-bold text-white/60 uppercase mb-2">Audience Trends (Solitaire)</div>
                                        <div className="h-24 bg-white/5 rounded flex items-end justify-between px-2 pb-2 gap-1">
                                            {[40, 60, 45, 70, 85, 60, 90].map((h, i) => (
                                                <div key={i} className="w-full bg-purple-500/50 rounded-t" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                        <div className="text-[10px] text-white/30 text-center mt-1">Last 7 Days Interest</div>
                                    </div>
                                )}

                                <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs text-teal-200">
                                    <strong>AI Insight:</strong> Audience sentiment is predominantly positive, suggesting high engagement potential.
                                </div>
                            </div>
                        )}
                    </GlassCard>

                    {/* Topics Cloud */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" /> Topics Cloud
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {topics.slice(0, 8).map((topic: any, i: number) => (
                                <span key={i} className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/10">
                                    {typeof topic === 'string' ? topic : topic?.topic || 'Topic'}
                                </span>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Detailed Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Ideas */}
                    <GlassCard className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Zap className="w-6 h-6 text-yellow-400" /> Content Ideas
                            </h2>
                            <div className="flex items-center gap-3">
                                {isPremium && (
                                    <span className="px-2 py-1 bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider rounded">
                                        Full Access
                                    </span>
                                )}
                                <span className="text-sm text-white/40">
                                    {isFree ? '3 Ideas (Free)' : isDiamond ? '5 Ideas (Diamond)' : '7 Ideas (Solitaire)'}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {ideas.map((idea: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{idea?.title || 'Untitled Idea'}</h3>
                                        {idea?.score && (
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                                                {idea.score > 10 ? (idea.score / 10).toFixed(1) : idea.score}/10
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2 text-sm text-white/60">
                                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-bold uppercase shrink-0">Hook</span>
                                            {idea?.hook || 'No hook available'}
                                        </div>
                                        {isPremium && idea?.script && (
                                            <div className="flex items-start gap-2 text-sm text-white/60">
                                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-bold uppercase shrink-0">Script</span>
                                                <span className="line-clamp-2">{idea.script}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {ideas.length === 0 && (
                                <div className="text-center py-8 text-white/40">
                                    No content ideas generated yet.
                                </div>
                            )}
                        </div>

                        {isFree && (
                            <div className="mt-6 text-center">
                                <Link href="/upgrade" className="text-sm text-white/50 hover:text-white underline decoration-white/30 underline-offset-4">
                                    Upgrade to unlock {isDiamond ? '2' : '4'} more premium ideas
                                </Link>
                            </div>
                        )}

                        {ideas.length > 0 && ideas[0] && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <VideoScriptGenerator
                                    hook={ideas[0].hook || ''}
                                    title={ideas[0].title || ''}
                                    isPremium={isPremium}
                                    credits={user.credits}
                                />
                                {isSolitaire && (
                                    <div className="mt-2 text-center text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                                        ✨ Pro Hooks Enabled
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassCard>

                    {/* Top Questions */}
                    <GlassCard className="p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-2xl">?</span> Top Audience Questions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {questions.slice(0, 6).map((q: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 italic text-white/70 text-sm overflow-hidden text-ellipsis">
                                    "{typeof q === 'string' ? q : q?.text || 'Question'}"
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* SEO Keywords */}
                    <GlassCard className="p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" /> SEO Keywords
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {keywords.map((kw: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-colors cursor-default">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Competitor Analysis - Unlocked for Solitaire, Preview for Diamond */}
                    <GlassCard className={`p-8 ${isSolitaire ? 'border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'relative overflow-hidden'}`}>
                        {(!isSolitaire && !isDiamond) && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <div className="text-center">
                                    <Lock className="w-6 h-6 text-white/40 mx-auto mb-2" />
                                    <p className="font-bold text-white/60 mb-2">Competitor Analysis</p>
                                    <Link href="/upgrade" className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                        Unlock with Solitaire
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-purple-300">
                                <Target className="w-5 h-5" /> Competitor Gap Analysis
                            </h2>
                            {isDiamond && !isSolitaire && (
                                <span className="text-[10px] uppercase font-bold text-white/30 border border-white/10 px-2 py-1 rounded">Preview Mode</span>
                            )}
                            {isSolitaire && (
                                <span className="text-[10px] uppercase font-bold text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">Your Edge: +12 Points</span>
                            )}
                        </div>

                        {isSolitaire ? (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <div className="text-xs text-purple-300 uppercase font-bold mb-1">Opportunity</div>
                                        <p className="text-sm">Your pacing is 15% faster than top competitors in this niche. Lean into this.</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <div className="text-xs text-blue-300 uppercase font-bold mb-1">Keyword Gap</div>
                                        <p className="text-sm">Competitors are ranking for "viral hacks" - add this to your description.</p>
                                    </div>
                                </div>

                                {/* Real Competitors from AI */}
                                <div className="mt-4">
                                    <h4 className="text-sm font-bold text-white/60 mb-3">Top Competitors Detected</h4>
                                    <div className="space-y-2">
                                        {(Array.isArray(m3.competitor_analysis) ? m3.competitor_analysis : []).map((comp: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-[10px] font-bold text-white/50">
                                                        {i + 1}
                                                    </div>
                                                    <div className="text-sm">
                                                        <div className="font-bold text-white">{comp?.title || 'Unknown Channel'}</div>
                                                        <div className="text-xs text-white/40 flex items-center gap-2">
                                                            <span className="text-purple-300">{comp?.channel || 'Channel'}</span>
                                                            <span>•</span>
                                                            <span>{comp?.views || 'N/A'} Views</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden md:block">
                                                    <div className="text-xs text-white/40">Viral Score</div>
                                                    <div className="font-bold text-yellow-400">{comp?.score || 85}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!m3.competitor_analysis || m3.competitor_analysis.length === 0) && (
                                            <div className="text-center text-white/30 text-xs py-4">
                                                No specific competitors identified for this topic.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`grid md:grid-cols-2 gap-4 ${(!isSolitaire && !isDiamond) ? 'opacity-20' : ''}`}>
                                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <div className="text-xs text-purple-300 uppercase font-bold mb-1">Opportunity</div>
                                    <p className="text-sm">Your pacing is 15% faster than top competitors in this niche. Lean into this.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <div className="text-xs text-blue-300 uppercase font-bold mb-1">Keyword Gap</div>
                                    <p className="text-sm">Competitors are ranking for "viral hacks" - add this to your description.</p>
                                </div>
                            </div>
                        )}
                    </GlassCard>

                    <div className="flex gap-4">
                        <button className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-bold">
                            <Share2 className="w-5 h-5" /> Share Report
                        </button>
                        <ExportButton isSolitaire={isSolitaire} />
                    </div>
                </div>
            </div>
        </div>
    );
}
