"use client";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button, Box, MenuItem, Select, TextField, InputAdornment, Popover } from "@mui/material";
import CustomCalendar from "./CustomCalender";

interface Item {
  id: number;
  itemName: string;
  quantity: number;
}

const FilterBar = ({ setFilters }: { setFilters: React.Dispatch<React.SetStateAction<any>> }) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [items, setItems] = useState<Item[]>([]);

  // Fetch items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/inventory');
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setItems(data.items || []);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleDatePickerClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (!selectedItem || !startDate || !endDate || !selectedFilter) {
      alert("Please select all filters before applying.");
      return;
    }

    const filters = {
      item: selectedItem,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      filter: selectedFilter
    };

    setFilters(filters);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2, alignItems: "center" }}>
      <Select
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)}
        displayEmpty
        size="small"
        sx={{ minWidth: 250 }}
      >
        <MenuItem value="">Select Item</MenuItem>
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id.toString()}>
            {item.itemName} ({item.quantity} in stock)
          </MenuItem>
        ))}
      </Select>

      <TextField
        size="small"
        value={startDate ? startDate.toDateString() : ""}
        onClick={handleDatePickerClick}
        placeholder="Select Date Range"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Calendar size={18} />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        sx={{ width: 250, ml: 4}}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <CustomCalendar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Popover>

      <Select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        displayEmpty
        size="small"
        sx={{ minWidth: 250, ml: 4, mr: 4 }}
      >
        <MenuItem value="">Filter By</MenuItem>
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
      </Select>

      <Button 
        variant="contained"
        onClick={handleApply}
        size="medium"
        
      >
        Apply
      </Button>
    </Box>
  );
};

export default FilterBar;