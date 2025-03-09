import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { issueId: string } }
) {
  try {
    const body = await request.json();
    const { itemId, returnDate } = body;

    if (!itemId || !returnDate) {
      return NextResponse.json({
        success: false,
        error: "Item ID and return date are required"
      }, { status: 400 });
    }

    // Update the issue item
    const updatedIssueItem = await prisma.issueItem.update({
      where: {
        issueId_itemId: {
          issueId: params.issueId,
          itemId: parseInt(itemId.toString())
        }
      },
      data: {
        returnDate,
        status: "RETURNED"
      }
    });

    // Check if all items in the issue are returned
    const issue = await prisma.issue.findUnique({
      where: { id: params.issueId },
      include: { items: true }
    });

    if (issue && issue.items.every(item => item.status === "RETURNED")) {
      // Update the main issue status if all items are returned
      await prisma.issue.update({
        where: { id: params.issueId },
        data: { status: "RETURNED" }
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedIssueItem
    });

  } catch (error: any) {
    console.error("Error updating return:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to update return"
    }, { status: 500 });
  }
} 