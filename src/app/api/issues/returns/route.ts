import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const returnedIssues = await prisma.issue.findMany({
      where: {
        status: "RETURNED"
      },
      include: {
        items: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: returnedIssues
    });
  } catch (error: any) {
    console.error("Error fetching returns:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch returns"
    }, { status: 500 });
  }
} 