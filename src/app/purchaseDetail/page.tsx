'use client';

import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';

const PurchaseOrder = ({
  voucherNo = 'NET/PO/2024/01',
  date = '12-Apr-24',
  paymentTerms = '100% ATT',
  referenceNo = 'N/A',
  dispatchedThrough = 'E-Delivery',
  destination = 'JDWNRH, National Medical Services, Thimphu, Bhutan',
  supplier = 'Redington Distribution PTE LTD',
  supplierAddress = '60 Robinson Road, #1-02 BEA Building, Singapore 068892',
  description = 'FortiGate - 200F Lic Renewal',
  dueOn = '19-May-24',
  quantity = 1,
  rate = 2906.72,
  amount = 2906.72,
}) => {
  const invoiceRef = useRef(null);

  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (element) {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('purchase_order.pdf');
    }
  };

  return (
    <div ref={invoiceRef} style={{ padding: '20px', backgroundColor: '#fff' }}>
      <TableContainer component={Paper} sx={{ border: '1px solid black', p: 3 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>PURCHASE ORDER</Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} sx={{ border: '1px solid black' }}>
                <Typography variant="h6">Invoice To</Typography>
                <Typography><b>New Edge Technologies Pvt. Ltd</b></Typography>
                <Typography>2nd Floor, City Mall, Chubachu</Typography>
                <Typography>P.O. Box-1616</Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ border: '1px solid black' }}>
                <Typography><b>Voucher No:</b> {voucherNo}</Typography>
                <Typography><b>Dated:</b> {date}</Typography>
                <Typography><b>Payment Terms:</b> {paymentTerms}</Typography>
                <Typography><b>Reference No:</b> {referenceNo}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} sx={{ border: '1px solid black' }}>
                <Typography variant="h6">Supplier</Typography>
                <Typography><b>{supplier}</b></Typography>
                <Typography>{supplierAddress}</Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ border: '1px solid black' }}>
                <Typography><b>Dispatched Through:</b> {dispatchedThrough}</Typography>
                <Typography><b>Destination:</b> {destination}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table sx={{ mt: 2, border: '1px solid black' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid black' }}>Sl No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid black' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid black' }}>Due On</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid black' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid black' }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid black' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: '1px solid black' }}>1</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{description}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{dueOn}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{quantity} Nos.</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{rate}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{amount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="h6" sx={{ mt: 2, p: 2, border: '1px solid black' }}>
          Amount Chargeable (in words): Ngultrum {amount.toLocaleString()} Only
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleDownload}>Download</Button>
        </Box>
      </TableContainer>
    </div>
  );
};

export default PurchaseOrder;