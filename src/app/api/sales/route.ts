import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ItemStatus, PaymentMode } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.itemId || !body.quantity || !body.amount || !body.customerName || !body.invoiceDetails) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "All fields are required"
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validate invoice details
    if (!body.invoiceDetails.invoiceNo || !body.invoiceDetails.invoiceTo || !body.invoiceDetails.paymentMode) {
      return NextResponse.json({
        success: false,
        error: "Invoice details are incomplete"
      }, { status: 400 });
    }

    // Get current date in ISO string format
    const currentDate = new Date().toISOString();

    // Get the current item to check stock
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(body.itemId.toString())
      }
    });

    if (!item) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Item not found"
        }),
        { status: 404 }
      );
    }

    // Check if enough stock is available
    if (item.quantity < body.quantity) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Insufficient stock"
        }),
        { status: 400 }
      );
    }

    // Calculate remaining quantity
    const remainingQuantity = item.quantity - body.quantity;

    try {
      // Start a transaction to ensure data consistency
      const [updatedItem, sale, salesInvoice] = await prisma.$transaction([
        // Update item quantity
        prisma.item.update({
          where: { 
            id: parseInt(body.itemId.toString())
          },
          data: {
            quantity: remainingQuantity,
            availability: remainingQuantity === 0 ? ItemStatus.OUTSTOCK : ItemStatus.INSTOCK
          }
        }),

        // Create the sale record
        prisma.sale.create({
          data: {
            itemId: parseInt(body.itemId.toString()),
            quantity: parseInt(body.quantity.toString()),
            amount: parseFloat(body.amount.toString()),
            customerName: body.customerName,
            date: currentDate
          }
        }),

        // Create the sales invoice
        prisma.salesInvoice.create({
          data: {
            invoiceTo: body.invoiceDetails.invoiceTo,
            date: currentDate,
            invoiceNo: body.invoiceDetails.invoiceNo,
            paymentMode: body.invoiceDetails.paymentMode.toUpperCase() as PaymentMode,
            consignee: body.invoiceDetails.consignee || null,
            deliveryNote: body.invoiceDetails.deliveryNote || null,
            destination: body.invoiceDetails.destination || null,
            dispatchedThrough: body.invoiceDetails.dispatchedThrough || null,
            termsOfDelivery: body.invoiceDetails.termsOfDelivery || null,
            totalAmount: parseFloat(body.amount.toString()),
            customerName: body.customerName,
            items: {
              create: {
                itemId: parseInt(body.itemId.toString()),
                description: item.description || "",
                quantity: parseInt(body.quantity.toString()),
                rate: parseFloat(item.price.toString()),
                amount: parseFloat(body.amount.toString())
              }
            }
          },
          include: {
            items: true
          }
        })
      ]);

      return new NextResponse(
        JSON.stringify({
          success: true,
          data: {
            sale,
            invoice: salesInvoice,
            itemOutOfStock: remainingQuantity === 0
          }
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (transactionError: any) {
      console.error("Transaction error:", transactionError);
      throw new Error(transactionError.message || "Failed to process sale");
    }

  } catch (error: any) {
    console.error("Sales API error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process sale"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 