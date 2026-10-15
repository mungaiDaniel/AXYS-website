import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { QUICKMART_IPO } from '@/lib/quickmart-ipo';

// Serves the Quick Mart PLC Information Memorandum if it has been uploaded to /public;
// otherwise sends the visitor to the official IPO portal, where the IM is published.
export async function GET() {
  try {
    const possiblePaths = [
      join(process.cwd(), 'public', 'Quickmart-IPO-Information-Memorandum.pdf'),
      join(process.cwd(), 'public', 'Information-Memorandum.pdf'),
    ];

    const filePath = possiblePaths.find((p) => existsSync(p));
    if (!filePath) {
      return NextResponse.redirect(QUICKMART_IPO.applyPortalUrl);
    }

    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Quickmart-IPO-Information-Memorandum.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
