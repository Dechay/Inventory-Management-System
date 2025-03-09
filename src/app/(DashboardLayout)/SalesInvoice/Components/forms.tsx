"use client"; 

import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, CircularProgress, Alert, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useRouter } from "next/navigation"; // Import useRouter
import { createInvoice, Invoice } from '@/app/services/salesInvoiceService';

interface FormData {
    invoiceTo: string;
    invoiceNo: string;
    date: string;
    consignee: string;
    paymentMode: string;
    referenceNo: string;
    deliveryNote: string;
    dispatchdocNo: string;
    supplier: string;
    dispatchedThrough: string;
    destination: string;
    buyersorderNo: string;
    termsofDelivery: string;
    description: string;
    quantity: string;
    rate: string;
    dueDate: string;
}

interface Item {
    id: number;
    itemName: string;
    price: number;
    quantity: number;
    description: string;
}

interface SalesInvoiceFormProps {
    onSave: (order: any) => void;
}

const SalesInvoiceForm: React.FC<SalesInvoiceFormProps> = ({ onSave }) => {
    const router = useRouter(); // Initialize router
    const [formData, setFormData] = useState<FormData>({
        invoiceTo: "",
        invoiceNo: "",
        date: "",
        consignee: "",
        paymentMode: "",
        referenceNo: "",
        deliveryNote: "",
        supplier: "",
        dispatchedThrough: "",
        buyersorderNo: "",
        dispatchdocNo: "",
        termsofDelivery: "",
        destination: "",
        description: "",
        quantity: "",
        rate: "",
        dueDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    // Move fetchItems outside useEffect
    const fetchItems = async () => {
        try {
            const response = await fetch('/api/inventory');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            // Filter only items with quantity > 0
            const inStockItems = data.items.filter((item: Item) => 
                item.quantity > 0
            );
            setItems(inStockItems);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to fetch items');
        }
    };

    // Use fetchItems in useEffect
    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => Object.values(formData).every((value) => value.trim() !== "");

    const calculateAmount = (quantity: number, rate: number) => {
        return quantity * rate;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Validate required fields
            if (!selectedItem || !formData.quantity || !formData.invoiceTo || 
                !formData.invoiceNo || !formData.date || !formData.paymentMode) {
                throw new Error('Please fill all required fields');
            }

            // Validate quantity
            const quantity = parseInt(formData.quantity);
            if (isNaN(quantity) || quantity <= 0 || quantity > selectedItem.quantity) {
                throw new Error('Please enter a valid quantity');
            }

            const amount = quantity * selectedItem.price;

            const saleData = {
                itemId: selectedItem.id,
                quantity: quantity,
                amount: amount,
                customerName: formData.invoiceTo,
                invoiceDetails: {
                    invoiceNo: formData.invoiceNo,
                    invoiceTo: formData.invoiceTo,
                    date: formData.date,
                    paymentMode: formData.paymentMode,
                    consignee: formData.consignee || null,
                    deliveryNote: formData.deliveryNote || null,
                    destination: formData.destination || null,
                    dispatchedThrough: formData.dispatchedThrough || null,
                    termsOfDelivery: formData.termsofDelivery || null
                }
            };

            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result?.error || 'Failed to create sales invoice');
            }

            setSuccess('Sales invoice created successfully');
            onSave(result.data);
            handleReset();
            
            // Refresh items list to update stock quantities
            fetchItems();
        } catch (error: any) {
            console.error('Sales error:', error);
            setError(error.message || 'Failed to create sales invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            invoiceTo: "",
            invoiceNo: "",
            date: "",
            consignee: "",
            paymentMode: "",
            referenceNo: "",
            deliveryNote: "",
            supplier: "",
            dispatchedThrough: "",
            buyersorderNo: "",
            dispatchdocNo: "",
            termsofDelivery: "",
            destination: "",
            description: "",
            quantity: "",
            rate: "",
            dueDate: ""
        });
        setSelectedItem(null);
    };

    // Update handleItemSelect to properly handle SelectChangeEvent
    const handleItemSelect = (event: SelectChangeEvent<string>) => {
        const itemId = event.target.value;
        const selected = items.find(item => item.id.toString() === itemId);
        if (selected) {
            setSelectedItem(selected);
            setFormData(prev => ({
                ...prev,
                description: selected.description || '',
                rate: selected.price.toString()
            }));
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Sales Invoice
                </Typography>

                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Invoice to" name="invoiceTo" multiline rows={2} variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Date" name="date" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Invoice No" name="invoiceNo" multiline rows={2} variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Payment Mode</InputLabel>
                            <Select
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleSelectChange}
                                label="Payment Mode"
                            >
                                <MenuItem value="CASH">Cash</MenuItem>
                                <MenuItem value="CREDIT">Credit</MenuItem>
                                <MenuItem value="ONLINE">Online</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Consignee (Ship to)" name="consignee" multiline rows={2} variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Supplier (Bill from)" name="supplier" multiline rows={2} variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Delivery Note" name="deliveryNote" variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Destination" name="destination" variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Buyers Order No" name="buyersorderNo" variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Dispatched Doc No" name="dispatchdocNo" variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Dispatched Through" name="dispatchedThrough" variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Terms of Delivery" name="termsofDelivery" variant="outlined" onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Reference No" name="referenceNo" variant="outlined" onChange={handleChange} />
                    </Grid>
                </Grid>

                <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                    Item Details
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="item-select-label">Select Item</InputLabel>
                            <Select
                                labelId="item-select-label"
                                id="item-select"
                                value={selectedItem?.id.toString() || ''}
                                label="Select Item"
                                onChange={handleItemSelect}
                                required
                            >
                                {items.map((item) => (
                                    <MenuItem key={item.id} value={item.id.toString()}>
                                        {item.itemName} (In Stock: {item.quantity})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {selectedItem && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        const qty = parseInt(e.target.value);
                                        if (qty <= selectedItem.quantity) {
                                            setFormData(prev => ({ ...prev, quantity: e.target.value }));
                                        }
                                    }}
                                    inputProps={{ 
                                        max: selectedItem.quantity,
                                        min: 1
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Rate"
                                    type="number"
                                    value={formData.rate}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    disabled
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button variant="contained" sx={{ mr: 2, backgroundColor: "darkgray", "&:hover": { backgroundColor: "gray" } }} onClick={handleReset}>
                        Discard
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Save"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SalesInvoiceForm;
