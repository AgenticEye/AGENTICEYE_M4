import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getUser, getVideoReports } from "@/lib/actions";
import VideoReportCard from "@/components/VideoReportCard";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { Video } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VideoReportsPage() {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        redirect("/api/auth/login");
    }

    const user = await getUser();
    const reports = await getVideoReports();
    const isFree = user?.tier === 'Free';

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Video className="w-8 h-8 text-purple-400" /> Video Scripts Library
                </h1>
                <div className="text-sm text-white/50">
                    {user?.credits} Credits Left
                </div>
            </div>

            {isFree && (
                <GlassCard className="mb-8 p-8 border-purple-500/30 bg-purple-900/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Unlock AI Video Scripts</h3>
                        <p className="text-white/60">Upgrade to Diamond to generate high-retention scripts instantly.</p>
                    </div>
                    <Link href="/upgrade" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                        Upgrade Now
                    </Link>
                </GlassCard>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <VideoReportCard key={report.id} report={report} />
                ))}

                {reports.length === 0 && (
                    <div className="col-span-full text-center py-20 text-white/30 border border-white/5 rounded-2xl bg-white/5 border-dashed">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No scripts generated yet.</p>
                        {!isFree && (
                            <p className="text-sm mt-2">Go to an analysis result to generate one.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
