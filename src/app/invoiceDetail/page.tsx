'use client';

import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceTable = ({
  invoiceNo = "N/A",
  referenceNo = "N/A",
  deliveryNote = "N/A",
  date = "N/A",
  termsPayment = "N/A",
  otherRef = "N/A",
  buyerOrder = "N/A",
  dispatchDoc = "N/A",
  dispatchThrough = "N/A",
  receiveDate = "N/A",
  noteDate = "N/A",
  destination = "N/A",
  consignee = "N/A",
  description = "N/A",
  buyer = "N/A",
  termsDelivery = "N/A",
  quantity = 0,
  rate = 0,
  amount = 0,
  sealSignature = "N/A",
}) => {
  const invoiceRef = useRef(null);

  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 } as any);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("invoice.pdf");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <TableContainer ref={invoiceRef} component={Paper} sx={{ p: 3, maxWidth: "100%", border: "1px solid black" }}>
        <Table sx={{ border: "1px solid black" }}>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                <Typography variant="h6">New Edge Technologies Pvt. Ltd</Typography>
                <Typography>2nd Floor, City Mall, Chubachu</Typography>
                <Typography>P.O. Box-1616</Typography>
                <Typography>TPN NO: NAC0078</Typography>
                <Typography>Contact: +975-02-336782/337189/337190</Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                <Typography><b>Invoice No:</b> {invoiceNo}</Typography>
                <Typography><b>Delivery Note:</b> {deliveryNote}</Typography>
                <Typography><b>Reference No. & Date:</b> {referenceNo}</Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
              <Typography><b>Dated:</b> {date}</Typography>
              <Typography><b>Terms of Payment:</b> {termsPayment}</Typography>
              <Typography><b>Other Reference(s):</b> {otherRef}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                <Typography><b>Consignee (Ship to):</b></Typography>
                <Typography>{consignee}</Typography>
              </TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                <Typography><b>Buyer&apos;s Order No.:</b> {buyerOrder}</Typography>
                <Typography><b>Dispatch Doc No. :</b> {dispatchDoc}</Typography>
                <Typography><b>Dispatched Through:</b> {dispatchThrough} </Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                <Typography><b>Dated:</b> {receiveDate}</Typography>
                <Typography><b>Delivery Note Date:</b> {noteDate}</Typography>
                <Typography><b>Destination:</b> {destination} </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                <Typography><b>Buyer (Bill to)</b></Typography>
                <Typography>{buyer}</Typography>
              </TableCell>
              <TableCell colSpan={4} sx={{ border: "1px solid black" }}>
                <Typography><b>Terms of Delivery:</b> {termsDelivery}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <Table sx={{ mt: 2, border: "1px solid black" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>Sl No</TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>Description of Goods</TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: "1px solid black" }}>1</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>{description}</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>{quantity} Nos.</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>{rate}</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>{amount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table sx={{ mt: 2, border: "1px solid black" }}>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                <Typography variant="h6">Amount Chargeable (in words)</Typography>
                <Typography>Ngultrum {amount.toLocaleString()} Only</Typography>
                <Typography><u>Declaration</u></Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table sx={{ mt: 2, border: "1px solid black" }}>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                <Typography variant="h6">Customer&apos;s Seal and Signature</Typography>
                <Typography>{sealSignature}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1
      }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#1366D9', color: 'white', marginRight: 2 }}
          onClick={handleDownload}
        >
          Download
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#1366D9', color: 'white', marginRight: 2 }}
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>
    </>
  );
};

export default InvoiceTable;
