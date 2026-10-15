import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const possiblePaths = [
      join(process.cwd(), 'public', 'Dangote-Brief-Presentation.pdf'),
      join(process.cwd(), 'public', 'Dangote Brief Presentation.pdf'),
      join(process.cwd(), 'Dangote Brief Presentation.pdf'),
    ];

    let filePath = null;
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Dangote-Brief-Presentation.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
