import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const customerName = formData.get('customerName') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const customerEmail = formData.get('customerEmail') as string | null;
    const file = formData.get('file') as File | null;

    if (!customerName || !customerPhone || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory may already exist
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);

    const prescription = await prisma.prescription.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        filePath: `/uploads/${fileName}`,
        status: 'pending'
      }
    });

    return NextResponse.json({ success: true, prescription });
  } catch (error) {
    console.error('Prescription upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload prescription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Failed to fetch prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}
