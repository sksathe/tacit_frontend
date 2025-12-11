import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { meeting_url } = body;

        if (!meeting_url) {
            return NextResponse.json(
                { error: 'meeting_url is required' },
                { status: 400 }
            );
        }

        const response = await fetch('https://tacitmeet.ngrok.dev/join-meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meeting_url,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || `HTTP error! status: ${response.status}` },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error proxying join-meeting request:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}




