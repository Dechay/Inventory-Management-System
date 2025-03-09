import axios from 'axios';
import { PaymentMode } from "@prisma/client";

export interface InvoiceItem {
  id: string;
  itemId: number;
  quantity: number;
  rate: number;
  amount: number;
  description: string;
}

export interface Invoice {
  invoiceTo: string;
  date: string;
  invoiceNo: string;
  paymentMode: string;
  consignee: string;
  supplier: string;
  deliveryNote: string;
  destination: string;
  buyersOrderNo: string;
  dispatchedDocNo: string;
  dispatchedThrough: string;
  termsOfDelivery: string;
  items: InvoiceItem[];
}

export interface InvoiceWithItems {
  id: string;
  invoiceNo: string;
  invoiceTo: string;
  date: string;
  customerName: string;
  paymentMode: PaymentMode;
  consignee?: string;
  deliveryNote?: string;
  destination?: string;
  dispatchedThrough?: string;
  termsOfDelivery?: string;
  totalAmount: number;
  items: InvoiceItem[];
}

// Create a custom event for invoice updates
export const INVOICE_CREATED_EVENT = 'invoiceCreated';

export const createInvoice = async (invoiceData: any) => {
  try {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create invoice');
    }

    // Dispatch custom event when invoice is created
    const event = new CustomEvent(INVOICE_CREATED_EVENT, { detail: data.data.invoice });
    window.dispatchEvent(event);

    return data;
  } catch (error) {
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    const response = await axios.get('/api/saleinvoice');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllInvoices = async (): Promise<InvoiceWithItems[]> => {
  try {
    const response = await fetch('/api/sales/invoices');
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}; 