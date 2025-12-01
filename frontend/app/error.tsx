'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('Full Error:', error)
        console.error('Digest:', error.digest)
    }, [error])

    if (error.message.includes('State not found') || error.message.includes('state mismatch')) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white p-8">
                <div className="text-center max-w-md">
                    <h2 className="text-3xl font-bold text-red-400 mb-4">Authentication Issue</h2>
                    <p className="text-gray-400 mb-6">
                        We encountered a security state mismatch. This usually happens if you waited too long or your session expired.
                    </p>
                    <a href="/api/auth/login" className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 inline-block">
                        Retry Login
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white p-8">
            <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold text-red-400 mb-4">Something Went Wrong</h2>
                <p className="text-gray-400 mb-6">The video is private, deleted, or temporarily unavailable. Try another link.</p>
                <button onClick={reset} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700">
                    Try Again
                </button>
            </div>
        </div>
    )
}
