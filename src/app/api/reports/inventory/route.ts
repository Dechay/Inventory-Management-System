import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getDateRange(startDate: string, endDate: string, filterType: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    switch (filterType) {
        case 'daily':
            return {
                gte: start.toISOString(),
                lte: end.toISOString()
            };
        case 'weekly':
            start.setDate(start.getDate() - start.getDay());
            end.setDate(end.getDate() + (6 - end.getDay()));
            return {
                gte: start.toISOString(),
                lte: end.toISOString()
            };
        case 'monthly':
            start.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            return {
                gte: start.toISOString(),
                lte: end.toISOString()
            };
        case 'yearly':
            start.setMonth(0, 1);
            end.setMonth(11, 31);
            return {
                gte: start.toISOString(),
                lte: end.toISOString()
            };
        default:
            return {
                gte: start.toISOString(),
                lte: end.toISOString()
            };
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('item');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const filterType = searchParams.get('filter');

        if (!itemId || !startDate || !endDate || !filterType) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const dateRange = getDateRange(startDate, endDate, filterType);

        // Get stock in (purchases)
        const stockIn = await prisma.purchaseItem.findMany({
            where: {
                itemId: parseInt(itemId),
                date: dateRange
            },
            include: {
                item: true
            },
            orderBy: {
                date: 'asc'
            }
        });

        // Get stock out (sales)
        const stockOut = await prisma.salesInvoiceItem.findMany({
            where: {
                itemId: parseInt(itemId),
                invoice: {
                    date: dateRange
                }
            },
            include: {
                item: true,
                invoice: true
            },
            orderBy: {
                invoice: {
                    date: 'asc'
                }
            }
        });

        // Get current item details
        const item = await prisma.item.findUnique({
            where: {
                id: parseInt(itemId)
            }
        });

        if (!item) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        // Calculate summaries
        const summary = {
            inwardQuantity: stockIn.reduce((sum, record) => sum + record.quantity, 0),
            inwardValue: stockIn.reduce((sum, record) => sum + (record.quantity * record.rate), 0),
            outwardQuantity: stockOut.reduce((sum, record) => sum + record.quantity, 0),
            outwardValue: stockOut.reduce((sum, record) => sum + record.amount, 0),
        };

        return NextResponse.json({
            success: true,
            data: {
                stockIn,
                stockOut,
                summary,
                currentStock: item,
                closingBalance: {
                    quantity: item.quantity,
                    value: item.quantity * item.price
                }
            }
        });

    } catch (error) {
        console.error('Error fetching inventory report:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch inventory report'
            },
            { status: 500 }
        );
    }
} 