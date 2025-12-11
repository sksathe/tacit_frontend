import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        const bucketName = 'k_doc';
        
        // List all files in the k_doc bucket
        const { data: files, error } = await supabaseAdmin.storage
            .from(bucketName)
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Error fetching files from Supabase:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to fetch documents' },
                { status: 500 }
            );
        }

        if (!files || files.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Filter for markdown files and get their public URLs
        const markdownFiles = files.filter(file => 
            file.name.toLowerCase().endsWith('.md') || 
            file.name.toLowerCase().endsWith('.markdown')
        );

        // Get public URLs for each file
        const documents = await Promise.all(
            markdownFiles.map(async (file) => {
                const { data: urlData } = supabaseAdmin.storage
                    .from(bucketName)
                    .getPublicUrl(file.name);

                // Try to get file metadata/size
                const { data: fileData } = await supabaseAdmin.storage
                    .from(bucketName)
                    .download(file.name);

                let size: string | undefined;
                if (fileData) {
                    const sizeInBytes = fileData.size;
                    if (sizeInBytes < 1024) {
                        size = `${sizeInBytes} B`;
                    } else if (sizeInBytes < 1024 * 1024) {
                        size = `${(sizeInBytes / 1024).toFixed(2)} KB`;
                    } else {
                        size = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
                    }
                }

                return {
                    id: file.name, // Use filename as ID since file.id might not exist
                    name: file.name.replace(/\.(md|markdown)$/i, ''),
                    description: `Markdown document from ${bucketName}`,
                    type: 'markdown' as const,
                    source: 'workflow' as const,
                    sourceId: file.name,
                    sourceName: 'Supabase Storage',
                    fileUrl: urlData.publicUrl,
                    content: undefined, // Will be fetched separately if needed
                    size,
                    projectId: 'project_personal',
                    createdAt: file.created_at || new Date().toISOString(),
                    updatedAt: file.updated_at || file.created_at || new Date().toISOString(),
                };
            })
        );

        return NextResponse.json(documents, { status: 200 });
    } catch (error) {
        console.error('Error in documents API route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

