'use client';

import React, { useState } from "react";
import SalesInvoiceForm from './Components/forms'; 
import { Box, Typography } from '@mui/material';

const SalesInvoice = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const handleSaveOrder = (order: { id: string; date: string; company: string; amount: string }) => {
    const updatedOrders = [...orders, order];

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <Box>
      <SalesInvoiceForm onSave={handleSaveOrder} />
    </Box>
  );
};

export default SalesInvoice;
