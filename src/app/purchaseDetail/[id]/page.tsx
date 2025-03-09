'use client';

import React, { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
    CircularProgress,
} from "@mui/material";
import { useParams } from 'next/navigation';
import { Print } from '@mui/icons-material';
import autoTable from 'jspdf-autotable';

interface PurchaseItem {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    receivedBy: string;
    date: string;
    dueOn?: string;
}

interface Purchase {
    id: number;
    voucherNo: string;
    date: string;
    paymentMode: string;
    referenceNo: string | null;
    dispatchedThrough: string | null;
    destination: string | null;
    termsOfDelivery: string | null;
    invoiceTo: string;
    consignee: string | null;
    supplier: {
        name: string;
        address?: string;
    };
    purchaseItems: PurchaseItem[];
}

const PurchaseDetail = () => {
    const params = useParams();
    const [purchase, setPurchase] = useState<Purchase | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPurchaseDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/purchases/${params.id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch purchase details');
                }

                setPurchase(data);
            } catch (error) {
                console.error('Error:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch purchase details');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPurchaseDetails();
        }
    }, [params.id]);

    const handlePrint = () => {
        const element = invoiceRef.current;
        if (element) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Purchase Order</title>
                            <style>
                                body { padding: 20px; }
                                table { width: 100%; border-collapse: collapse; }
                                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                                .header { text-align: center; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            ${element.outerHTML}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            }
        }
    };

    const handleDownload = async () => {
        const element = invoiceRef.current;
        if (element) {
            // Temporarily hide the buttons
            const buttons = element.querySelectorAll('button');
            buttons.forEach(button => button.style.display = 'none');

            // Generate PDF
            const canvas = await html2canvas(element, { scale: 3, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`PO-${purchase?.voucherNo}.pdf`);

            // Restore the buttons
            buttons.forEach(button => button.style.display = '');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!purchase) return <Typography>Purchase order not found</Typography>;

    return (
        <div ref={invoiceRef} style={{ padding: '20px', backgroundColor: '#fff', maxWidth: '900px', margin: 'auto' }}>
            <TableContainer component={Paper} sx={{ p: 3, border: '1px solid #000' }}>
                <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                    PURCHASE ORDER
                </Typography>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #000', width: '50%' }}>
                                <Typography variant="subtitle2">Invoice To</Typography>
                                <Typography><b>{purchase?.invoiceTo || "New Edge Technologies Pvt. Ltd."}</b></Typography>
                                <Typography>2nd Floor, City Mall, Chubachu</Typography>
                                <Typography>P.O. Box-1616</Typography>
                                <Typography>TPN No: NAC00078</Typography>
                                <Typography>Contact: +975-02-330570/337620/337619/336-+975-17417539/17191451</Typography>
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #000', width: '50%' }}>
                                <Typography><b>Voucher No:</b> {purchase?.voucherNo}</Typography>
                                <Typography><b>Dated:</b> {new Date(purchase?.date || '').toLocaleDateString()}</Typography>
                                <Typography><b>Mode/Terms of Payment:</b> {purchase?.paymentMode}</Typography>
                                <Typography><b>Reference No. & Date:</b> {purchase?.referenceNo || 'N/A'}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #000' }}>
                                <Typography variant="subtitle2">Consignee (Ship to)</Typography>
                                <Typography><b>New Edge Technologies Pvt. Ltd.</b></Typography>
                                <Typography>2nd Floor, City Mall, Chubachu</Typography>
                                <Typography>P.O. Box-1616</Typography>
                                <Typography>Thimphu</Typography>
                                <Typography>e-mail: info@newedge.bt</Typography>
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #000' }}>
                                <Typography><b>Dispatched through:</b> {purchase?.dispatchedThrough || 'E-Delivery'}</Typography>
                                <Typography><b>Destination:</b> {purchase?.destination}</Typography>
                                <Typography><b>Terms of Delivery:</b> {purchase?.termsOfDelivery || 'E-Delivery of Licenses'}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ border: '1px solid #000' }}>
                                <Typography variant="subtitle2">Supplier (Bill from)</Typography>
                                <Typography><b>{purchase?.supplier.name}</b></Typography>
                                <Typography>{purchase?.supplier.address}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Table sx={{ mt: 2, border: '1px solid #000' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Sl No</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Description of Goods</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Due on</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Rate</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>per</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchase?.purchaseItems.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ border: '1px solid #000' }}>{index + 1}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{item.description}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{item.dueOn || '19-May-24'}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{item.quantity} Nos.</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{item.rate.toFixed(2)}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>Nos.</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{(item.quantity * item.rate).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={3} sx={{ border: '1px solid #000', textAlign: 'right' }}>Total</TableCell>
                            <TableCell sx={{ border: '1px solid #000' }}>{purchase?.purchaseItems.reduce((sum, item) => sum + item.quantity, 0)} Nos.</TableCell>
                            <TableCell colSpan={2} sx={{ border: '1px solid #000' }}></TableCell>
                            <TableCell sx={{ border: '1px solid #000' }}>{purchase?.purchaseItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2)} Nu.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Box sx={{ mt: 2, border: '1px solid #000', p: 1 }}>
                    <Typography>Amount Chargeable (in words):</Typography>
                    <Typography>Ngultrum {purchase?.purchaseItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toLocaleString()} Only</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 2 }}>
                    <Box>
                        <Typography align="center">for New Edge Technologies Pvt. Ltd.</Typography>
                        <Typography align="center" sx={{ mt: 4 }}>Authorised Signatory</Typography>
                    </Box>
                </Box>

                <Typography variant="body2" sx={{ mt: 2 }}>This is a Computer Generated Document</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" startIcon={<Print />} onClick={handlePrint} sx={{ mr: 2 }}>
                        Print
                    </Button>
                    <Button variant="contained" onClick={handleDownload}>
                        Download
                    </Button>
                </Box>
            </TableContainer>
        </div>
    );
};

export default PurchaseDetail; 