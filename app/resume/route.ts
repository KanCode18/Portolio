import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const resumeSourceFileName = 'Kanishk-Chhabra-Resume.pdf';
const resumeDownloadFileName = 'Kanishk-Chhabra-Resume.pdf';

export async function GET() {
  try {
    const resumePath = path.join(process.cwd(), 'public', resumeSourceFileName);
    const resume = await readFile(resumePath);

    return new NextResponse(new Uint8Array(resume), {
      headers: {
        'Content-Disposition': `attachment; filename="${resumeDownloadFileName}"`,
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch {
    return NextResponse.json(
      { message: `Resume file not found. Add ${resumeSourceFileName} to the public folder.` },
      { status: 404 }
    );
  }
}
