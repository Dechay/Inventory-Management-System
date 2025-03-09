import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: { name: body.name }
    });

    return NextResponse.json({
      success: true,
      category: updatedCategory
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: parseInt(params.id) }
    });
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
} 