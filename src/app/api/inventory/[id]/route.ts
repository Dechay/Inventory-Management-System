import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedItem = await prisma.item.update({
      where: { 
        id: parseInt(params.id) 
      },
      data: {
        itemName: body.itemName,
        moduleNo: body.moduleNo,
        serialNo: body.serialNo,
        price: parseFloat(body.price),
        description: body.description,
        uom: body.uom,
        quantity: parseInt(body.quantity),
        unit: body.unit,
        categoryId: parseInt(body.categoryId),
        supplierName: body.supplierName,
        availability: body.availability,
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem
    });
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id);

    // Use transaction to ensure all related records are deleted
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.purchaseItem.deleteMany({
        where: { itemId }
      });

      await tx.salesInvoiceItem.deleteMany({
        where: { itemId }
      });

      await tx.issueItem.deleteMany({
        where: { itemId }
      });

      // Finally delete the item
      await tx.item.delete({
        where: { id: itemId }
      });
    });

    return NextResponse.json({
      success: true,
      message: "Item and all related records deleted successfully"
    });

  } catch (error: any) {
    console.error('Error deleting item:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false,
          error: "Item not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete item" 
      },
      { status: 500 }
    );
  }
} 