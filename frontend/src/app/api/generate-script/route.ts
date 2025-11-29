import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, duration, tone, notes } = body;

        const params = new URLSearchParams({
            title: title || '',
            duration: duration || '60s',
            tone: tone || 'Energetic',
            notes: notes || ''
        });

        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000'
            : `https://${process.env.VERCEL_URL}/api/py`;

        // Call Python Backend
        const res = await fetch(`${baseUrl}/m3/generate-script?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Backend responded with ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Script generation error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate script' }, { status: 500 });
    }
}
