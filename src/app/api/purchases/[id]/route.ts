import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { 
        id: parseInt(params.id) 
      },
      include: {
        supplier: true,
        purchaseItems: {
          include: {
            item: true
          }
        }
      }
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return NextResponse.json(
      { error: "Failed to fetch purchase details" },
      { status: 500 }
    );
  }
}