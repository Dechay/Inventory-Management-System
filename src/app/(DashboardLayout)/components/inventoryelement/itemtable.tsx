"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Card, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState } from "react";

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "itemName", label: "Item Name", minWidth: 170 },
  { id: "moduleNo", label: "Module No.", minWidth: 100 },
  { id: "serialNo", label: "Serial No.", minWidth: 100 },
  { id: "price", label: "Price", minWidth: 100, align: "center", format: (value: number) => `Nu. ${value.toFixed(2)}` },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "uom", label: "UOM", minWidth: 100 },
  { id: "quantity", label: "Quantity", minWidth: 100, align: "center" },
  { id: "unit", label: "Unit", minWidth: 100 },
  { id: "categoryName", label: "Category", minWidth: 130 },
  { id: "supplierName", label: "Supplier", minWidth: 170 },
  { id: "availability", label: "Availability", minWidth: 130 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

interface Data {
  id: number;
  itemName: string;
  moduleNo: string;
  serialNo: string;
  price: number;
  description: string;
  uom: string;
  quantity: number;
  unit: string;
  categoryName: string;
  categoryId: number;
  supplierName: string;
  availability: string;
  actions?: string;
}

function createData(
  item_id: string,
  item_name: string,
  sub_category: string,
  category: string,
  module_no: string,
  serial_no: string,
  price: number,
  description: string,
  uom: string,
  quantity: number,
  supplier: string,
  purchase_date: string,
  availability: string,
  action: string
): Data {
  return {
    id: 0,
    itemName: item_name,
    moduleNo: module_no,
    serialNo: serial_no,
    price: price,
    description: description,
    uom: uom,
    quantity: quantity,
    unit: "",
    categoryName: category,
    categoryId: 0,
    supplierName: supplier,
    availability: availability,
  };
}

interface Props {
  inventoryData: any[];
  availability: string;
  filterByCategory: string;
  searchQuery: string;
}

// Define toast type
type ToastType = 'success' | 'error' | 'info' | 'warning';

const InventoryTable = ({ inventoryData, availability, filterByCategory, searchQuery }: Props) => {
  const [editItem, setEditItem] = useState<Data | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Data | null>(null);
  const [toast, setToast] = useState<{ 
    open: boolean; 
    message: string; 
    type: ToastType  // Use the defined ToastType
  }>({ 
    open: false, 
    message: '', 
    type: 'success' 
  });
  const [formData, setFormData] = useState({
    itemName: '',
    moduleNo: '',
    serialNo: '',
    price: '',
    description: '',
    uom: '',
    quantity: '',
    unit: '',
    categoryId: '',
    supplierName: '',
    availability: 'INSTOCK'
  });

  // Update showToast function
  const showToast = (message: string, type: ToastType) => {
    setToast({
      open: true,
      message,
      type
    });
  };

  // Handle edit click with notification
  const handleEditClick = (item: Data) => {
    setEditItem(item);
    setFormData({
      itemName: item.itemName,
      moduleNo: item.moduleNo,
      serialNo: item.serialNo,
      price: item.price.toString(),
      description: item.description,
      uom: item.uom,
      quantity: item.quantity.toString(),
      unit: item.unit,
      categoryId: item.categoryId.toString(),
      supplierName: item.supplierName,
      availability: item.availability
    });
    setOpenEditDialog(true);
    showToast('Editing item: ' + item.itemName, 'info');
  };

  // Handle delete click with notification
  const handleDeleteClick = (item: Data) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
    showToast('Please confirm deletion of: ' + item.itemName, 'warning');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enhanced update handler
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/inventory/${editItem?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update item');
      }

      showToast(`Successfully updated ${formData.itemName}`, 'success');
      setOpenEditDialog(false);
      
      // Refresh the data without full page reload
      window.dispatchEvent(new CustomEvent('refreshInventory'));
    } catch (error: any) {
      showToast(error.message || 'Failed to update item', 'error');
    }
  };

  // Enhanced delete handler
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/inventory/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete item');
      }

      showToast(`Successfully deleted ${itemToDelete.itemName}`, 'success');
      setOpenDeleteDialog(false);
      
      // Refresh the data without full page reload
      window.dispatchEvent(new CustomEvent('refreshInventory'));
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
      setOpenDeleteDialog(false);
    }
  };

  // Enhanced dialog close handlers
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    showToast('Edit cancelled', 'info');
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    showToast('Delete cancelled', 'info');
  };

  // Transform the data to include category name
  const transformedData = inventoryData.map(item => ({
    ...item,
    categoryName: item.category?.name || 'Unknown Category'
  }));

  // Enhanced filter function
  const filteredData = transformedData.filter(item => {
    // Search across multiple fields with improved matching
    const searchFields = [
      item.itemName,
      item.moduleNo,
      item.serialNo,
      item.categoryName,
      item.supplierName,
      item.description,
      item.unit,
      item.uom
    ].map(field => (field || '').toLowerCase());

    const searchTerms = searchQuery.toLowerCase().split(' ');
    const matchesSearch = searchQuery === '' || searchTerms.every(term =>
      searchFields.some(field => field.includes(term))
    );

    // Category filter with exact match
    const matchesCategory = !filterByCategory || 
      item.categoryId.toString() === filterByCategory;

    // Availability filter with exact status match
    const matchesAvailability = !availability || 
      (availability === "INSTOCK" ? item.availability === "INSTOCK" && item.quantity > 0 : 
       availability === "OUTSTOCK" ? item.availability === "OUTSTOCK" || item.quantity === 0 : true);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Enhanced sort function
  const sortedData = [...filteredData].sort((a, b) => {
    // First sort by availability (in stock first)
    if (a.availability !== b.availability) {
      return a.availability === "INSTOCK" ? -1 : 1;
    }

    // Then by category
    const categoryCompare = a.categoryName.localeCompare(b.categoryName);
    if (categoryCompare !== 0) return categoryCompare;
    
    // Then by item name
    return a.itemName.localeCompare(b.itemName);
  });

  return (
    <>
      <Card variant="outlined" sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ 
                      minWidth: column.minWidth,
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No items found matching your search criteria
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow 
                    hover 
                    key={row.id}
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    {columns.map((column) => {
                      if (column.id === 'actions' as keyof Data) {
                        return (
                          <TableCell key={`${row.id}-${column.id}`} align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton 
                                  onClick={() => handleEditClick(row)} 
                                  size="small"
                                  sx={{ padding: '4px' }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  onClick={() => handleDeleteClick(row)} 
                                  size="small"
                                  color="error"
                                  sx={{ padding: '4px' }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        );
                      }
                      if (column.id === "availability") {
                        return (
                          <TableCell key={`${row.id}-${column.id}`} align={column.align}>
                            <span
                              style={{
                                color: row.availability === "INSTOCK" ? "green" : "red",
                              }}
                            >
                              {row.availability === "INSTOCK" ? "In Stock" : "Out of Stock"}
                            </span>
                          </TableCell>
                        );
                      }
                      const value = row[column.id];
                      return (
                        <TableCell key={`${row.id}-${column.id}`} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Updated Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Module No."
              name="moduleNo"
              value={formData.moduleNo}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Serial No."
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="UOM"
              name="uom"
              value={formData.uom}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Category ID"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Supplier Name"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Updated Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Are you sure you want to delete {itemToDelete?.itemName}?
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Toast Notification */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={toast.type} 
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': { fontSize: '1rem' },
            boxShadow: 3
          }}
          elevation={6}
          variant="filled"
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InventoryTable;