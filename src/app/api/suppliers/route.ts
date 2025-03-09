import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(suppliers);
  } catch (error: any) {
    console.log('Error fetching suppliers:', error);
    return NextResponse.json(
      { message: "Error fetching suppliers", error: error.message },
      { status: 500 }
    );
  }
} 