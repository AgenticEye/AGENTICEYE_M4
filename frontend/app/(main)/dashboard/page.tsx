'use client'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useState } from 'react'
import DashboardClient from "@/components/Dashboard"

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false)
    // Mock data to prevent crashes since we removed server actions
    const [data, setData] = useState<{ user: any, history: any[] } | null>({
        user: { credits: 999, tier: 'Solitaire', id: 'guest' },
        history: []
    })

    useEffect(() => {
        setMounted(true)
        // We are now pure frontend, so we don't fetch from server actions.
        // In a real app, we would fetch from the Render backend here if endpoints exist.
    }, [])

    if (!mounted || !data) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-purple-600 rounded-full border-t-transparent"></div>
            </div>
        )
    }

    return <DashboardClient user={data.user} history={data.history} />
}
