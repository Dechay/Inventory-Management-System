import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        itemName: true,
        price: true,
      },
      orderBy: {
        itemName: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.itemName || !body.moduleNo || !body.serialNo || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        itemName: body.itemName,
        moduleNo: body.moduleNo,
        serialNo: body.serialNo,
        price: parseFloat(body.price),
        description: body.description || "",
        uom: body.uom || "",
        quantity: parseInt(body.quantity) || 0,
        unit: body.unit || "",
        categoryId: parseInt(body.categoryId),
        supplierName: body.supplierName || "",
        availability: body.availability as ItemStatus || "INSTOCK",
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create item" },
      { status: 500 }
    );
  }
} 