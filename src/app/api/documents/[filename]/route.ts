import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } | Promise<{ filename: string }> }
) {
    try {
        // Handle both Promise and direct params (Next.js 16 compatibility)
        const resolvedParams = params instanceof Promise ? await params : params;
        const filenameParam = resolvedParams?.filename;
        
        console.log('API Route - Filename param received:', filenameParam);
        
        if (!filenameParam) {
            console.error('Filename parameter is missing:', { resolvedParams, params });
            return NextResponse.json(
                { error: 'Filename parameter is required', debug: { resolvedParams, params } },
                { status: 400 }
            );
        }
        
        let filename = decodeURIComponent(filenameParam);
        
        // Remove any query parameters or fragments that might have been included
        filename = filename.split('?')[0].split('#')[0];
        
        // Validate filename
        if (!filename || filename === 'undefined' || filename.trim() === '') {
            console.error('Invalid filename:', { filenameParam, decoded: filename });
            return NextResponse.json(
                { error: 'Invalid filename provided', debug: { filenameParam, decoded: filename } },
                { status: 400 }
            );
        }
        
        console.log('API Route - Fetching file:', { original: filenameParam, decoded: filename });
        
        const bucketName = 'k_doc';
        
        // Download the file content
        const { data, error } = await supabaseAdmin.storage
            .from(bucketName)
            .download(filename);

        if (error) {
            console.error('Error fetching file from Supabase:', {
                error,
                filename,
                bucketName,
                errorMessage: error.message,
                errorDetails: JSON.stringify(error)
            });
            return NextResponse.json(
                { error: error.message || 'Failed to fetch file', details: error },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Convert blob to text
        const text = await data.text();

        return NextResponse.json({ content: text }, { status: 200 });
    } catch (error) {
        console.error('Error in document content API route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

