// src/app/(DashboardLayout)/PurchaseOrders/Components/forms.tsx
'use client'; // Make sure it's a client component

import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, CircularProgress, Alert, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { createPurchaseOrder, PurchaseOrder } from '@/app/services/purchaseOrderService';

interface FormData {
  invoiceTo: string;
  date: string;
  quantity: string;
  rate: string;
  paymentMode: string;
  voucherNo: string;
  referenceNo: string;
  consignee: string;
  supplierId: string;
  dispatchedThrough: string;
  termsOfDelivery: string;
  destination: string;
  description: string;
  receivedBy: string;
  itemName: string;
  supplier: string;
}

interface PurchaseOrderFormProps {
  onSave: (order: any) => void;
  onCancel: () => void;
}

const COMPANY_DETAILS = `NewEdge Technology Pvt Ltd,
2nd floor Citymall Chubachu,
P.O.Box 1616,
TPN No: NAC00078,
Contact No: +975`;

interface Category {
  id: number;
  name: string;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    invoiceTo: "",
    date: "",
    quantity: "",
    rate: "",
    paymentMode: "",
    voucherNo: "",
    referenceNo: "",
    consignee: "",
    supplierId: "",
    dispatchedThrough: "",
    termsOfDelivery: "",
    destination: "",
    description: "",
    receivedBy: "",
    itemName: "",
    supplier: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [openNewCategoryDialog, setOpenNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for Select component
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => Object.values(formData).every((value) => value.trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.itemName || !formData.quantity || !formData.rate || !selectedCategory) {
        throw new Error('Please fill all required fields');
      }

      const purchaseData = {
        invoiceTo: formData.invoiceTo,
        date: formData.date,
        voucherNo: formData.voucherNo,
        referenceNo: formData.referenceNo || null,
        consignee: formData.consignee || null,
        paymentMode: formData.paymentMode as 'CASH' | 'CREDIT' | 'ONLINE',
        supplier: formData.supplier,
        dispatchedThrough: formData.dispatchedThrough || null,
        termsOfDelivery: formData.termsOfDelivery || null,
        destination: formData.destination || null,
        categoryId: selectedCategory,
        items: [{
          itemName: formData.itemName,
          description: formData.description,
          receivedBy: formData.receivedBy,
          date: formData.date,
          quantity: Number(formData.quantity),
          rate: Number(formData.rate),
        }]
      };

      const response = await fetch('/api/purchaseorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create purchase order');
      }

      showSnackbar('Purchase order created successfully', 'success');
      onSave(result.purchase);
      onCancel(); // Close the form
    } catch (error: any) {
      console.error('Purchase order error:', error);
      showSnackbar(error.message || 'Failed to create purchase order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceTo: "",
      date: "",
      quantity: "",
      rate: "",
      paymentMode: "",
      voucherNo: "",
      referenceNo: "",
      consignee: "",
      supplierId: "",
      dispatchedThrough: "",
      termsOfDelivery: "",
      destination: "",
      description: "",
      receivedBy: "",
      itemName: "",
      supplier: "",
    });
  };

  const handleDiscard = () => {
    resetForm();
    onCancel();
  };

  // Add useEffect to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showSnackbar('Failed to fetch categories', 'error');
      }
    };

    fetchCategories();
  }, []);

  // Add helper function for snackbar
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Add function to create new category
  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        setCategoryError("Category name is required");
        return;
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create category');
      }

      // Add new category to the list and select it
      setCategories([...categories, result]);
      setSelectedCategory(result.id.toString());
      setNewCategoryName("");
      setOpenNewCategoryDialog(false);
      showSnackbar('Category created successfully', 'success');
    } catch (error: any) {
      console.error('Error creating category:', error);
      setCategoryError(error.message || 'Failed to create category');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Purchase Orders
        </Typography>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="invoice-to-label">Invoice to</InputLabel>
              <Select
                labelId="invoice-to-label"
                name="invoiceTo"
                value={formData.invoiceTo}
                onChange={handleSelectChange}
                label="Invoice to"
              >
                <MenuItem value={COMPANY_DETAILS}>{COMPANY_DETAILS}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Dated"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true}}
              onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Voucher No"
              name="voucherNo"
              multiline rows={2}
              variant="outlined"
              onChange={handleChange}
               />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Reference No"
              name="referenceNo"
              variant="outlined"
              
              onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Consignee (Ship to)"
              name="consignee"
              multiline rows={2}
              variant="outlined"
              onChange={handleChange}
              />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="paymentMode-label">Payment Mode</InputLabel>
              <Select
                labelId="paymentMode-label"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleSelectChange}
                label="Payment Mode"
                error={!!error && !formData.paymentMode}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CREDIT">Credit</MenuItem>
                <MenuItem value="ONLINE">Online</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Supplier (Bill from)"
              name="supplier"
              multiline rows={2}
              variant="outlined"
              onChange={handleChange}
               />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Dispatched Through"
              name="dispatchedThrough"
              variant="outlined"
              onChange={handleChange}
               />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Terms of Delivery"
              name="termsofDelivery"
              multiline rows={2}
              variant="outlined"
              onChange={handleChange}
               />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth
              label="Destination"
              name="destination"
              variant="outlined"
              onChange={handleChange}
               />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
                <MenuItem 
                  value="new"
                  onClick={() => setOpenNewCategoryDialog(true)}
                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                >
                  + Add New Category
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
          Item Details
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              error={!!error && !formData.itemName}
              helperText={!!error && !formData.itemName ? "Item name is required" : ""}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Description of Goods"
              name="description"
              multiline rows={2}
              variant="outlined"
              onChange={handleChange}
               />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Received by"
              name="receivedBy"
              multiline
              rows={2}
              variant="outlined"
              onChange={handleChange}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Due On"
              name="Date"
              type="date"
              
              onChange={handleChange} 
              InputLabelProps={{ shrink: true}}/>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth label="Quantity"
              name="quantity"
              type="number"
              variant="outlined"
              onChange={handleChange}
              />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth label="Rate"
              name="rate"
              type="number"
              variant="outlined"
              onChange={handleChange}
              />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="contained" 
            sx=
              {{  mr: 1, 
                backgroundColor: "darkgray", "&:hover": { backgroundColor: "gray" } 
              }}
            color="error" 
            onClick={handleDiscard}
            disabled={loading}
          >
            Discard
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Add New Category Dialog */}
        <Dialog 
          open={openNewCategoryDialog} 
          onClose={() => {
            setOpenNewCategoryDialog(false);
            setCategoryError("");
            setNewCategoryName("");
          }}
        >
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              variant="outlined"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setCategoryError("");
              }}
              error={!!categoryError}
              helperText={categoryError}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenNewCategoryDialog(false);
                setCategoryError("");
                setNewCategoryName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderForm;