import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { message: "Error fetching invoices", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    // Format the date as ISO string
    const formattedDate = new Date(body.date).toISOString();

    // Validate required fields
    if (!body.invoiceTo || !body.date || !body.invoiceNo || !body.items) {
      console.log('Missing required fields:', { 
        invoiceTo: !!body.invoiceTo, 
        date: !!body.date, 
        invoiceNo: !!body.invoiceNo, 
        items: !!body.items 
      });
      return NextResponse.json(
        { message: "Missing required fields", receivedData: body },
        { status: 400 }
      );
    }

    try {
      // Log the data we're about to insert
      console.log('Attempting to create invoice with data:', {
        invoiceTo: body.invoiceTo,
        date: body.date,
        invoiceNo: body.invoiceNo,
        paymentMode: body.paymentMode || "Cash",
      });

      // Create invoice first
      const invoice = await prisma.invoice.create({
        data: {
          invoiceTo: body.invoiceTo,
          date: formattedDate,
          invoiceNo: body.invoiceNo,
          paymentMode: body.paymentMode || "Cash",
          consignee: body.consignee || null,
          supplier: body.supplier || null,
          deliveryNote: body.deliveryNote || null,
          destination: body.destination || null,
          buyersOrderNo: body.buyersOrderNo || null,
          dispatchedDocNo: body.dispatchedDocNo || null,
          dispatchedThrough: body.dispatchedThrough || null,
          termsOfDelivery: body.termsOfDelivery || null,
        },
      });

      console.log('Invoice created:', invoice);

      // Log item data before creation
      console.log('Attempting to create items:', body.items);

      // Create items one by one
      const items = [];
      for (const item of body.items) {
        console.log('Creating item:', item);
        const createdItem = await prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            description: item.description,
            hsnCode: item.hsnCode || 'HSN-001',
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            amount: Number(item.amount),
          },
        });
        items.push(createdItem);
      }

      console.log('Items created:', items);
      return NextResponse.json({ invoice, items }, { status: 201 });

    } catch (dbError: any) {
      console.error('Database error details:', {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta,
        stack: dbError.stack
      });
      
      return NextResponse.json(
        { 
          message: "Database error",
          error: dbError.message,
          code: dbError.code,
          meta: dbError.meta,
          details: dbError.stack
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Request error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        message: "Error processing request",
        error: error.message,
        details: error.stack
      },
      { status: 500 }
    );
  }
}
