"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  DialogContentText,
  Grid,
  Card,
  ListItem,
  List,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
} from "@mui/material";
import InventoryTable from "./itemtable";
import { Add, Delete, Close } from "@mui/icons-material";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { Add as AddIcon } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";

interface Props {
  inventoryData: {
    items: any[];
    categories: any[];
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
  onItemAdded: () => void;
  onSearch: (query: string) => void;
  onFilterCategory: (categoryId: string) => void;
  onFilterAvailability: (status: string) => void;
}

interface InventoryItem {
  id: number;
  itemName: string;
  moduleNo: string;
  serialNo: string;
  price: number;
  description: string;
  uom: string;
  quantity: number;
  unit: string;
  categoryId: number;
  supplierName: string;
  availability: 'INSTOCK' | 'OUTSTOCK';
}

interface Category {
  id: number;
  name: string;
}

const Buttons: React.FC<Props> = ({ 
  inventoryData, 
  onItemAdded, 
  onSearch, 
  onFilterCategory, 
  onFilterAvailability 
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [subcategory, setSubcategory] = React.useState("");
  const [catego, setcatego] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [avail, setAvail] = React.useState("");
  const [openAddCategoryDialog, setOpenAddCategoryDialog] =
    React.useState(false);
  const [openViewCategoryDialog, setOpenViewCategoryDialog] =
    React.useState(false);
  const [openDeleteCategory, setOpenDeleteCategory] = React.useState(false);
  const [filterByCategory, setFilterByCategory] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = React.useState<number | null>(
    null
  ); // Track category to delete
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = React.useState({
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
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [openNewCategoryDialog, setOpenNewCategoryDialog] = React.useState(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = React.useState<any[]>([]);
  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [openAddItem, setOpenAddItem] = React.useState(false);

  // Fetch categories when component mounts
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddNewCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        alert('Please enter a category name');
        return;
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCategories(); // Refresh categories list
        setNewCategoryName(''); // Clear input
        setOpenNewCategoryDialog(false); // Close dialog
        
        // Set the newly created category as the selected category
        setFormData(prev => ({
          ...prev,
          categoryId: data.id.toString()
        }));
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFilterByCategory(value);
    onFilterCategory(value);
  };

  const handleAvailabilityChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setAvailability(value);
    onFilterAvailability(value);
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      setNewCategoryName("");
      setOpenAddCategory(false);
      onItemAdded(); // This will refresh the data including categories
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete !== null) {
      setCategories(
        categories.filter((category) => category.id !== categoryToDelete)
      );
      setOpenDeleteCategory(false);
    }
  };

  //card view dialog
  const [openViewCategory1, setOpenViewCategory1] = React.useState(false);
  const [items, setItems] = React.useState([
    "Dell XPS 13",
    "MacBook Pro 16",
    "Lenovo ThinkPad X1",
    "Asus ZenBook 14",
    "Acer Swift 3",
    "Razer Blade 15",
  ]);
  const [newItem, setNewItem] = React.useState("");

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleChange =
    (setter: {
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (arg0: any): any;
    }) =>
    (event: { target: { value: any } }) =>
      setter(event.target.value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    
    // Handle "Add New Category" selection
    if (name === 'categoryId' && value === 'new') {
      setOpenNewCategoryDialog(true);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.itemName || !formData.moduleNo || !formData.serialNo || !formData.price || !formData.categoryId) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity) || 0,
          categoryId: parseInt(formData.categoryId),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      setOpenAddItem(false);
      setFormData({
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
      onItemAdded();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  // Calculate items count per category
  const getCategoryItemCount = (categoryId: number) => {
    return inventoryData.items.filter(item => item.categoryId === categoryId).length;
  };

  return (
    <Box>
      <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterByCategory}
            onChange={handleCategoryChange}
            label="Filter by Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {inventoryData?.categories?.map((category: any) => (
              <MenuItem key={category.id} value={category.id.toString()}>
                {category.name} ({inventoryData.items.filter(item => item.categoryId === category.id).length})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Availability</InputLabel>
          <Select
            value={availability}
            onChange={handleAvailabilityChange}
            label="Availability"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="INSTOCK">In Stock</MenuItem>
            <MenuItem value="OUTSTOCK">Out of Stock</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddCategory(true)}
        >
          Add Category
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddItem(true)}
        >
          Add Item
        </Button>
      </Paper>

      <Dialog open={openAddCategory} onClose={() => setOpenAddCategory(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCategory(false)} variant="contained" sx={{  mr: 1, backgroundColor: "darkgray", "&:hover": { backgroundColor: "gray" } }}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddItem} onClose={() => setOpenAddItem(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              required
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="Module No"
              name="moduleNo"
              value={formData.moduleNo}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="Serial No"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="Price"
              name="price"
              type="number"
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
              multiline
              rows={2}
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
              type="number"
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
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                label="Category"
              >
                {inventoryData?.categories?.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Supplier Name"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddItem(false)} variant="contained" sx={{  mr: 1, backgroundColor: "darkgray", "&:hover": { backgroundColor: "gray" } }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Buttons;
