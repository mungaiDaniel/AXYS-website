// Force dynamic to bypass caching for immediate file availability
export const dynamic = 'force-dynamic';

// Serve research paper files with proper headers
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request, { params }) {
  try {
    const { filename } = await params;

    // Security: Prevent directory traversal
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Build file path
    const filePath = join(process.cwd(), 'public', 'research', filename);

    // Read file from disk
    const fileData = await readFile(filePath);

    // Return with proper headers for immediate availability
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Content-Length': fileData.length,
      },
    });
  } catch (error) {
    console.error('Error serving research file:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}
