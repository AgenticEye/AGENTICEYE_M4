import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { redirect } from "next/navigation";
import GlassCard from "@/components/GlassCard";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (isAuth) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10">
      <GlassCard className="p-12 max-w-4xl backdrop-blur-2xl bg-black/30 border-white/10 shadow-[0_0_150px_rgba(139,92,246,0.3)] animate-in fade-in zoom-in duration-1000">
        <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 drop-shadow-2xl">
          AGENTIC EYE
        </h1>
        <p className="text-2xl md:text-3xl text-white/60 mb-12 font-light tracking-wide">
          Viral Content Prediction Engine
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <LoginLink className="px-12 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            Enter God Mode
          </LoginLink>
          <RegisterLink className="px-12 py-5 rounded-full bg-white/5 border border-white/20 backdrop-blur-md font-bold text-xl hover:bg-white/10 hover:border-white/40 transition-all">
            Request Access
          </RegisterLink>
        </div>
      </GlassCard>
      <footer className="absolute bottom-6 text-center text-xs text-white/30 tracking-widest uppercase">
        Localhost Only • Neon PostgreSQL • God Mode Enabled
      </footer>
    </div>
  );
}
