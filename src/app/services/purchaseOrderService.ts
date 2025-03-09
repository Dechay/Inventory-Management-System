import axios from 'axios';

export interface PurchaseItem {
  itemId: number;
  description: string;
  receivedBy: string;
  date: string;
  quantity: number;
  rate: number;
}

export interface PurchaseOrder {
  invoiceTo: string;
  date: string;
  voucherNo: string;
  referenceNo?: string;
  consignee?: string;
  paymentMode: 'CASH' | 'CREDIT' | 'ONLINE';
  supplier: string;
  dispatchedThrough?: string;
  termsOfDelivery?: string;
  destination?: string;
  items: Array<{
    itemId: number;
    description: string;
    receivedBy: string;
    date: string;
    quantity: number;
    rate: number;
  }>;
}

export interface SupplierDetails {
  id: number;
  name: string;
}

export interface PurchaseOrderWithItems extends Omit<PurchaseOrder, 'supplier'> {
  id: number;
  createdAt: string;
  updatedAt: string;
  supplier: SupplierDetails;
  purchaseItems: PurchaseItem[];
}

export const createPurchaseOrder = async (data: PurchaseOrder) => {
  try {
    const response = await fetch('/api/purchaseorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create purchase order');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllPurchaseOrders = async (): Promise<PurchaseOrderWithItems[]> => {
  try {
    const response = await axios.get('/api/purchaseorder');
    return response.data;
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Error fetching purchase orders:', error);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch purchase orders');
  }
}; 