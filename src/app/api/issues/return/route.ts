import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.issueId || !body.itemId) {
      return NextResponse.json({
        success: false,
        error: "Issue ID and Item ID are required"
      }, { status: 400 });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the issue status
      const updatedIssue = await tx.issue.update({
        where: {
          id: body.issueId
        },
        data: {
          status: "RETURNED"
        },
        include: {
          items: true
        }
      });

      // 2. Update the issue item status
      await tx.issueItem.update({
        where: {
          issueId_itemId: {
            issueId: body.issueId,
            itemId: parseInt(body.itemId.toString())
          }
        },
        data: {
          status: "RETURNED",
          returnDate: new Date().toISOString()
        }
      });

      // 3. Update the inventory item status
      await tx.item.update({
        where: {
          id: parseInt(body.itemId.toString())
        },
        data: {
          availability: ItemStatus.INSTOCK,
          quantity: 1 // Reset quantity to 1 when returned
        }
      });

      return updatedIssue;
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error("Return processing error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process return"
    }, { status: 500 });
  }
} 