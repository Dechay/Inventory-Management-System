'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';
import { useRouter } from 'next/navigation';

interface PurchaseItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  receivedBy: string;
  date: string;
  item: {
    itemName: string;
  };
}

interface Purchase {
  id: number;
  date: string;
  invoiceTo: string;
  voucherNo: string;
  supplier: {
    name: string;
  };
  purchaseItems: PurchaseItem[];
}

const PurchaseReport = () => {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchase');
      if (!response.ok) {
        throw new Error('Failed to fetch purchase orders');
      }
      const data = await response.json();
      
      // Filter out any invalid purchases
      const validPurchases = data.filter((p: any) => 
        p && p.purchaseItems && p.purchaseItems.length > 0 && p.supplier
      );
      setPurchases(validPurchases);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(err instanceof Error ? err.message : 'Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (purchase: Purchase) => {
    router.push(`/purchaseDetail/${purchase.id}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Purchase Orders
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Voucher No</TableCell>
                <TableCell>Invoice To</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases && purchases.length > 0 ? (
                purchases.map((purchase) => (
                  purchase.purchaseItems.map((item) => (
                    <TableRow key={`${purchase.id}-${item.id}`}>
                      <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                      <TableCell>{purchase.voucherNo}</TableCell>
                      <TableCell>{purchase.invoiceTo}</TableCell>
                      <TableCell>{purchase.supplier.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>Nu. {item.rate.toFixed(2)}</TableCell>
                      <TableCell>Nu. {(item.quantity * item.rate).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleView(purchase)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardCard>
  );
};

export default PurchaseReport;