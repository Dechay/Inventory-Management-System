'use client';

import React, { useRef, useEffect, useState } from 'react';
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
    Box,
    CircularProgress
} from "@mui/material";
import { useParams } from 'next/navigation';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { InvoiceWithItems } from '@/app/services/salesInvoiceService';

const InvoiceDetail = () => {
    const params = useParams();
    const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const storedInvoice = localStorage.getItem('selectedInvoice');
        if (storedInvoice) {
            setInvoice(JSON.parse(storedInvoice));
        }
        setLoading(false);
    }, [params.id]);

    const handleDownload = async () => {
        const element = invoiceRef.current;
        if (element) {
            const canvas = await html2canvas(element, { scale: 2 });
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!invoice) {
        return (
            <Box p={3}>
                <Typography color="error">Invoice not found</Typography>
            </Box>
        );
    }

    const totalAmount = invoice.items.reduce((sum, item) => sum + item.amount, 0);

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
                                <Typography><b>Invoice No:</b> {invoice.invoiceNo}</Typography>
                                <Typography><b>Delivery Note:</b> {invoice.deliveryNote || 'N/A'}</Typography>
                                <Typography><b>Reference No. & Date:</b> {invoice.id}</Typography>
                            </TableCell>
                            <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                                <Typography><b>Dated:</b> {new Date(invoice.date).toLocaleDateString()}</Typography>
                                <Typography><b>Terms of Payment:</b> {invoice.paymentMode}</Typography>
                                <Typography><b>Other Reference(s):</b> N/A</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                                <Typography><b>Consignee (Ship to):</b></Typography>
                                <Typography>{invoice.consignee || 'N/A'}</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                                <Typography><b>Buyer&apos;s Order No.:</b> {invoice.buyersOrderNo || 'N/A'}</Typography>
                                <Typography><b>Dispatch Doc No. :</b> {invoice.dispatchedDocNo || 'N/A'}</Typography>
                                <Typography><b>Dispatched Through:</b> {invoice.dispatchedThrough || 'N/A'}</Typography>
                            </TableCell>
                            <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                                <Typography><b>Dated:</b> {new Date(invoice.date).toLocaleDateString()}</Typography>
                                <Typography><b>Delivery Note Date:</b> {new Date(invoice.date).toLocaleDateString()}</Typography>
                                <Typography><b>Destination:</b> {invoice.destination || 'N/A'}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                                <Typography><b>Buyer (Bill to)</b></Typography>
                                <Typography>{invoice.invoiceTo}</Typography>
                            </TableCell>
                            <TableCell colSpan={4} sx={{ border: "1px solid black" }}>
                                <Typography><b>Terms of Delivery:</b> {invoice.termsOfDelivery || 'N/A'}</Typography>
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
                        {invoice.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ border: "1px solid black" }}>{index + 1}</TableCell>
                                <TableCell sx={{ border: "1px solid black" }}>{item.description}</TableCell>
                                <TableCell sx={{ border: "1px solid black" }}>{item.quantity} Nos.</TableCell>
                                <TableCell sx={{ border: "1px solid black" }}>₹{item.rate.toFixed(2)}</TableCell>
                                <TableCell sx={{ border: "1px solid black" }}>₹{item.amount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Table sx={{ mt: 2, border: "1px solid black" }}>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", border: "1px solid black" }}>
                                <Typography variant="h6">Amount Chargeable (in words)</Typography>
                                <Typography>Ngultrum {totalAmount.toLocaleString()} Only</Typography>
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
                                <Typography>_____________________</Typography>
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

export default InvoiceDetail;