export interface Item {
  id: number;
  itemName: string;
  moduleNo: string;
  serialNo: string;
  price: number;
  description: string;
  uom: string;
  quantity: number;
  unit: string;
  categoryId: number;
  supplierName: string;
  availability: 'INSTOCK' | 'OUTSTOCK';
}

export interface Category {
  id: number;
  name: string;
  items?: Item[];
}

export interface InventoryData {
  items: Item[];
  categories: Category[];
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
} 