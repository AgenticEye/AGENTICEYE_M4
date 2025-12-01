import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getHistory } from "@/lib/actions";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { ArrowLeft, Calendar, Link as LinkIcon } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HistoryPage() {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        redirect("/api/auth/login");
    }

    const history = await getHistory();

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Analysis History</h1>
                </div>
                <div className="text-white/50">
                    {history.length} Total Scans
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                    <Link key={item.id} href={`/results/${item.id}`}>
                        <GlassCard className="hover:bg-white/10 transition-all hover:-translate-y-1 cursor-pointer group h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`text-4xl font-bold ${item.viralScore >= 8 ? 'text-green-400' : item.viralScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {item.viralScore.toFixed(1)}
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                    <LinkIcon className="w-4 h-4 text-white/50" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-sm text-white/70 line-clamp-2 font-medium">
                                    {item.url}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-white/30">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                                    style={{ width: `${(item.viralScore / 10) * 100}%` }}
                                />
                            </div>
                        </GlassCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}
