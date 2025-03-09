import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,
        purchaseItems: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(purchases);
  } catch (error: any) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { message: "Error fetching purchases", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.supplier || !body.invoiceTo || !body.date || !body.voucherNo || !body.categoryId || !body.items?.length) {
      return NextResponse.json(
        { 
          success: false,
          message: "Missing required fields",
          error: "Please fill all required fields including category and items"
        },
        { status: 400 }
      );
    }

    // Create the purchase order
    const purchase = await prisma.purchase.create({
      data: {
        invoiceTo: body.invoiceTo,
        date: new Date(body.date),
        voucherNo: body.voucherNo,
        referenceNo: body.referenceNo || null,
        consignee: body.consignee || null,
        paymentMode: body.paymentMode,
        supplier: {
          connectOrCreate: {
            where: { name: body.supplier },
            create: { name: body.supplier }
          }
        },
        dispatchedThrough: body.dispatchedThrough || null,
        termsOfDelivery: body.termsOfDelivery || null,
        destination: body.destination || null,
        purchaseItems: {
          create: body.items.map((item: any) => ({
            description: item.description,
            receivedBy: item.receivedBy,
            date: new Date(item.date),
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            item: {
              create: {
                itemName: item.itemName,
                moduleNo: "TBD",
                serialNo: "TBD",
                price: item.rate,
                description: item.description || "",
                uom: "UNIT",
                quantity: item.quantity,
                unit: "PCS",
                categoryId: parseInt(body.categoryId),
                supplierName: body.supplier,
              }
            }
          }))
        }
      },
      include: {
        supplier: true,
        purchaseItems: {
          include: {
            item: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      purchase
    });
  } catch (error: any) {
    console.error('Purchase order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create purchase order' 
      },
      { status: 500 }
    );
  }
}