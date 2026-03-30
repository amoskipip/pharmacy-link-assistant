import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        status,
        notes
      }
    });

    return NextResponse.json({ success: true, prescription });
  } catch (error) {
    console.error('Failed to update prescription:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
}
