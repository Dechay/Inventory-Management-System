import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // We'll create this
import { ItemStatus } from "@prisma/client";

// GET all inventory items
export async function GET() {
  try {
    // Get all items with their categories
    const items = await prisma.item.findMany({
      include: {
        category: true
      }
    });

    // Get categories with their items
    const categories = await prisma.category.findMany({
      include: {
        items: true
      }
    });

    // Calculate summary statistics
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.quantity < 10).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return NextResponse.json({
      items,
      categories,
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalValue
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}

// POST new inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the received data
    console.log("Received form data:", body);

    // Validate required fields
    if (!body.itemName || !body.moduleNo || !body.serialNo || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the item
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

    console.log("Created item:", item);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Database error:", error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A unique constraint would be violated" },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
} 