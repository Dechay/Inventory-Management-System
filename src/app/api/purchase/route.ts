import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentMode } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    // Validate required fields
    if (!body.invoiceTo || !body.date || !body.voucherNo || !body.paymentMode) {
      return NextResponse.json(
        { 
          success: false,
          message: "Missing required fields"
        },
        { status: 400 }
      );
    }

    // First create or get the supplier using just the name
    const supplier = await prisma.supplier.upsert({
      where: { 
        name: body.supplier.name || body.supplier 
      },
      update: {},
      create: { 
        name: body.supplier.name || body.supplier,
        contact: body.supplier.contact || null,
        email: body.supplier.email || null,
        address: body.supplier.address || null
      }
    });

    // Create the purchase with the supplier
    const purchase = await prisma.purchase.create({
      data: {
        invoiceTo: body.invoiceTo,
        date: new Date(body.date),
        voucherNo: body.voucherNo,
        referenceNo: body.referenceNo,
        consignee: body.consignee,
        paymentMode: body.paymentMode as PaymentMode,
        dispatchedThrough: body.dispatchedThrough,
        termsOfDelivery: body.termsOfDelivery,
        destination: body.destination,
        supplier: {
          connect: {
            id: supplier.id
          }
        },
        purchaseItems: {
          create: body.purchaseItems.map((item: any) => ({
            itemId: item.itemId,
            description: item.description,
            receivedBy: item.receivedBy,
            date: new Date(item.date),
            quantity: parseInt(item.quantity),
            rate: parseFloat(item.rate)
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
    console.error('Purchase creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create purchase'
      },
      { status: 500 }
    );
  }
}

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
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}