"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow 
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';

interface Item {
  id: number;
  itemName: string;
  moduleNo: string;
  serialNo: string;
  price: number;
  quantity: number;
  description: string;
  availability: string;
}

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    items?: Item[];
  };
  onDelete: (id: number) => void;
  onViewItems: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onDelete, onViewItems }) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemCount = category.items?.length || 0;

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      onDelete(category.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="div">
              {category.name}
            </Typography>
            <Typography color="text.secondary">
              {itemCount} items
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={() => onViewItems(category.id)}
            >
              View Items
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* View Items Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{category.name} - Items</DialogTitle>
        <DialogContent>
          {category.items && category.items.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Module No</TableCell>
                  <TableCell>Serial No</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.moduleNo}</TableCell>
                    <TableCell>{item.serialNo}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Nu. {item.price}</TableCell>
                    <TableCell>{item.availability}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No items in this category</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{category.name}"? 
            {itemCount > 0 && ` This category contains ${itemCount} items.`}
          </Typography>
          {itemCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Deleting this category will affect {itemCount} items.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryCard; 