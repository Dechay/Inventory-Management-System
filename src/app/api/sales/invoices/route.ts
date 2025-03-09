import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.salesInvoice.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Retrieved invoices:', invoices); // Debug log

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error("Error fetching sales invoices:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch sales invoices" },
      { status: 500 }
    );
  }
} 