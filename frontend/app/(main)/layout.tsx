import Sidebar from "@/components/Sidebar";
import UserOrb from "@/components/UserOrb";
import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const dynamic = 'force-dynamic';

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
        redirect("/api/auth/login");
    }

    const user = await getUser();

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <UserOrb credits={user?.credits || 0} tier={user?.tier || 'Free'} />
            <div className="flex-1 ml-64 p-8 relative z-10">
                {children}
            </div>
        </div>
    );
}
