import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields with better error messages
    if (!body.employeeId || !body.employeeName || !body.contact) {
      return NextResponse.json({
        success: false,
        error: "Employee ID, name and contact are required"
      }, { status: 400 });
    }

    if (!body.items?.length) {
      return NextResponse.json({
        success: false,
        error: "At least one item is required"
      }, { status: 400 });
    }

    // Log the received data for debugging
    console.log('Received data:', body);

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the main issue record
      const issue = await tx.issue.create({
        data: {
          employeeId: body.employeeId,
          employeeName: body.employeeName,
          contact: body.contact,
          itemsCount: body.items.length,
          status: "ISSUED",
          items: {
            create: body.items.map((item: any) => ({
              itemId: parseInt(item.itemId.toString()),
              itemName: item.itemName,
              serialNumber: item.serialNumber,
              issueDate: new Date().toISOString(),
              status: "ISSUED"
            }))
          }
        },
        include: {
          items: true
        }
      });

      // 2. Update each item's status in inventory using proper enum
      for (const item of body.items) {
        await tx.item.update({
          where: { 
            id: parseInt(item.itemId.toString()) 
          },
          data: {
            availability: ItemStatus.OUTSTOCK,
            quantity: 0
          }
        });
      }

      return issue;
    });

    // Log the created data for debugging
    console.log('Created issue:', result);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    // Proper error logging and handling
    console.error("Issue creation error:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create issue"
    }, { status: 500 });
  }
}

// GET endpoint to fetch all issues
export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(issues);
  } catch (error: any) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch issues"
    }, { status: 500 });
  }
} 