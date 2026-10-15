import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import { rateLimit } from '@/lib/security';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request) {
  try {
    // Get IP for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // Rate limit: 20 downloads per minute per IP
    const rateCheck = rateLimit(ipAddress, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many download requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Find document in database
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Extract filename from fileUrl (e.g., /documents/1234567890-filename.pdf)
    const fileName = document.fileUrl.split('/').pop();
    
    // Try multiple possible paths (for different deployment scenarios)
    const possiblePaths = [
      join(process.cwd(), 'public', 'documents', fileName),
      join(process.cwd(), '.next', 'standalone', 'public', 'documents', fileName),
      join(process.cwd(), 'documents', fileName),
    ];
    
    let filePath = null;
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        filePath = path;
        break;
      }
    }

    // Check if file exists
    if (!filePath) {
      console.error(`File not found. Tried paths:`, possiblePaths);
      console.error(`Document fileUrl: ${document.fileUrl}, fileName: ${fileName}`);
      return NextResponse.json(
        { error: 'File not found on server. Please contact support.' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Increment download count
    await Document.findByIdAndUpdate(id, {
      $inc: { downloadCount: 1 },
    });

    // Determine content type
    const contentType = document.fileType || 'application/octet-stream';
    const originalFileName = document.fileName || fileName;

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${originalFileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
