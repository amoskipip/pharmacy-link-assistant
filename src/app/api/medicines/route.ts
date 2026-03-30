import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(medicines);
  } catch (error) {
    console.error('Failed to fetch medicines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category, requiresPrescription, image } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        requiresPrescription: requiresPrescription || false,
        image
      }
    });

    return NextResponse.json({ success: true, medicine });
  } catch (error) {
    console.error('Failed to create medicine:', error);
    return NextResponse.json(
      { error: 'Failed to create medicine' },
      { status: 500 }
    );
  }
}
