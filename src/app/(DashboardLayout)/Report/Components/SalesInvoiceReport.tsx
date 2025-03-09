'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { getAllInvoices, InvoiceWithItems } from '@/app/services/salesInvoiceService';
import DashboardCard from '../../components/shared/DashboardCard';

const SalesInvoiceReport = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAllInvoices();
        setInvoices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleView = (invoice: InvoiceWithItems) => {
    localStorage.setItem('selectedInvoice', JSON.stringify(invoice));
    router.push(`/invoiceDetail/${invoice.id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <DashboardCard>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Sales Invoice Report
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Bill to (Company)</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const totalAmount = invoice.items.reduce(
                  (sum, item) => sum + item.amount,
                  0
                );

                return (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.invoiceTo}</TableCell>
                    <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleView(invoice)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {invoices.length === 0 && (
          <Box p={3} textAlign="center">
            <Typography>No invoices found</Typography>
          </Box>
        )}
      </Box>
    </DashboardCard>
    
  );
};

export default SalesInvoiceReport;