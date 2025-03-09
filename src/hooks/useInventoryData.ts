import { useState, useEffect } from 'react';
import { InventoryData } from '@/types/inventory';

export const useInventoryData = () => {
  const [inventoryData, setInventoryData] = useState<InventoryData>({
    items: [],
    categories: [],
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      
      const data = await response.json();
      
      setInventoryData({
        items: data.items || [],
        categories: data.categories || [],
        totalItems: data.items?.length || 0,
        lowStockItems: data.items?.filter((item: any) => item.quantity < 10).length || 0,
        outOfStockItems: data.items?.filter((item: any) => item.quantity === 0).length || 0,
        totalValue: data.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0
      });
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return { inventoryData, isLoading, error, refreshData };
}; 