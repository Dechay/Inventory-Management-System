import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get current date and start of year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get all sales for the current year
    const sales = await prisma.sale.findMany({
      where: {
        date: {
          gte: startOfYear.toISOString(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get all purchases for the current year
    const purchases = await prisma.purchase.findMany({
      where: {
        date: {
          gte: startOfYear.toISOString(),
        },
      },
      include: {
        purchaseItems: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group sales by month
    const salesByMonth = Array(12).fill(0);
    sales.forEach(sale => {
      const month = new Date(sale.date).getMonth();
      salesByMonth[month] += Number(sale.amount);
    });

    // Group purchases by month
    const purchasesByMonth = Array(12).fill(0);
    purchases.forEach(purchase => {
      const month = new Date(purchase.date).getMonth();
      const amount = purchase.purchaseItems.reduce((sum, item) => 
        sum + (Number(item.rate) * Number(item.quantity)), 0);
      purchasesByMonth[month] += amount;
    });

    return NextResponse.json({
      sales: salesByMonth,
      purchases: purchasesByMonth,
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    );
  }
} 