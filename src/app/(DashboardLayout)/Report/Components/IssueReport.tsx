'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Autocomplete, IconButton } from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';
import { useRouter } from "next/navigation";
import { Add, Delete } from '@mui/icons-material';
import { IconFileReport } from '@tabler/icons-react';

interface Item {
  itemName: string;
  serialNumber: string;
  issueDate: string;
}

interface IssueItem {
  id: string;
  itemId: number;
  itemName: string;
  serialNumber: string;
  issueDate: string;
  returnDate: string | null;
  status: string;
}

interface Issue {
  id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  itemsCount: number;
  status: string;
  items: IssueItem[];
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  id: number;
  itemName: string;
  serialNo: string;
  availability: string;
}

const issues: Issue[] = [
  
]

const IssueReport = () => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [returnedItems, setReturnedItems] = useState<Issue[]>([]); // New state to track returned items
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [newItemsInHand, setNewItemsInHand] = useState(0);
  const [newItemList, setNewItemList] = useState<Item[]>([{ itemName: '', serialNumber: '', issueDate: '' }]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const router = useRouter();

  // Fetch in-stock items when component mounts
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        // Filter only in-stock items
        const inStockItems = data.items.filter((item: InventoryItem) => 
          item.availability === 'INSTOCK'
        );
        setInventoryItems(inStockItems);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);

  const handleAddItem = () => {
    setNewItemList([...newItemList, { itemName: '', serialNumber: '', issueDate: '' }]);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | InventoryItem) => {
    const updatedItems = [...newItemList];
    if (field === 'itemName' && typeof value !== 'string') {
      // If an item is selected from autocomplete
      updatedItems[index] = {
        ...updatedItems[index],
        itemName: value.itemName,
        serialNumber: value.serialNo,
        itemId: value.id // Add itemId to track the selected item
      };
    } else {
      // For manual input or other fields
      updatedItems[index][field] = value as string;
    }
    setNewItemList(updatedItems);
  };

  const handleSaveAddIssue = async () => {
    try {
      if (!newEmployeeId || !newEmployeeName || !newContactNumber || !newItemList.length) {
        alert('Please fill all required fields');
        return;
      }

      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: newEmployeeId,
          employeeName: newEmployeeName,
          contact: newContactNumber,
          itemsCount: newItemsInHand,
          items: newItemList.map(item => ({
            itemId: item.itemId || 0,
            itemName: item.itemName,
            serialNumber: item.serialNumber,
            issueDate: item.issueDate
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create issue');
      }

      // Show success message
      alert('Issue details saved!');

      // Reset form
      setNewEmployeeId('');
      setNewEmployeeName('');
      setNewContactNumber('');
      setNewItemsInHand(0);
      setNewItemList([{ itemName: '', serialNumber: '', issueDate: '' }]);
      setOpenAddDialog(false);

      // Refresh issues list
      fetchIssues();

    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Failed to create issue. Please try again.');
    }
  };

  const handleSaveEdit = () => {
    if (selectedIssue) {
      selectedIssue.employeeName = newEmployeeName;
      selectedIssue.contact = newContactNumber;
      selectedIssue.itemsCount = newItemsInHand;
      selectedIssue.items = newItemList.map(item => ({
        id: '',
        itemId: item.itemId || 0,
        itemName: item.itemName,
        serialNumber: item.serialNumber,
        issueDate: item.issueDate,
        returnDate: null,
        status: 'ISSUED'
      }));
    }
    alert('Issue details updated!');
    setOpenEditDialog(false);
  };

  const handleSaveReturn = async () => {
    if (selectedIssue) {
      try {
        // First update the inventory items
        for (const item of selectedIssue.items) {
          const response = await fetch('/api/issues/return', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              issueId: selectedIssue.id,
              itemId: item.itemId,
              serialNumber: item.serialNumber
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update inventory');
          }
        }

        // Then save to return report
        const storedReturns = localStorage.getItem('returns');
        const updatedReturns = storedReturns ? JSON.parse(storedReturns) : [];
        
        // Add return date to each item
        const returnedIssue = {
          ...selectedIssue,
          status: 'RETURNED',
          items: selectedIssue.items.map(item => ({
            ...item,
            returnDate: new Date().toISOString(),
            status: 'RETURNED'
          }))
        };
        
        updatedReturns.push(returnedIssue);
        localStorage.setItem('returns', JSON.stringify(updatedReturns));

        alert('Items returned successfully!');
        setOpenReturnDialog(false);
        
        // Redirect to return report page
        router.push('/Report/ReturnReport');

      } catch (error) {
        console.error('Error processing return:', error);
        alert('Failed to process return. Please try again.');
      }
    } else {
      console.log('No issue selected.');
    }
  };
  
  
  
  

  const handleDialogClose = () => {
    setOpenViewDialog(false);
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenReturnDialog(false);
  };

  const handleViewClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setOpenViewDialog(true);
  };

  const handleEditClick = () => {
    if (selectedIssue) {
      setNewEmployeeId(selectedIssue.employeeId);
      setNewEmployeeName(selectedIssue.employeeName);
      setNewContactNumber(selectedIssue.contact);
      setNewItemsInHand(selectedIssue.itemsCount);
      setNewItemList(selectedIssue.items.map(item => ({
        itemName: item.itemName,
        serialNumber: item.serialNumber,
        issueDate: item.issueDate
      })));
    }
    setOpenEditDialog(true);
  };

  const handleReturnClick = async (issueId: string, itemId: number) => {
    try {
      if (!confirm('Are you sure you want to return this item?')) {
        return;
      }

      const response = await fetch('/api/issues/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId,
          itemId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process return');
      }

      alert('Item returned successfully');
      fetchIssues(); // Refresh the issues list

    } catch (error) {
      console.error('Error processing return:', error);
      alert('Failed to process return. Please try again.');
    }
  };

  // Add function to fetch issues
  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  // Add useEffect to fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <DashboardCard>
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Issue Details
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
            Add Issue Details
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left"><b>Employee ID</b></TableCell>
                <TableCell align="left"><b>Employee Name</b></TableCell>
                <TableCell align="left"><b>Contact</b></TableCell>
                <TableCell align="center"><b>Items Count</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell align="left">{issue.employeeId}</TableCell>
                  <TableCell align="left">{issue.employeeName}</TableCell>
                  <TableCell align="left">{issue.contact}</TableCell>
                  <TableCell align="center">{issue.itemsCount}</TableCell>
                  <TableCell align="center">{issue.status}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button 
                        variant="text" 
                        sx={{ color: 'blue' }} 
                        onClick={() => handleViewClick(issue)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleReturnClick(issue.id, issue.items[0].itemId)}
                        disabled={issue.status === 'RETURNED'}
                      >
                        {issue.status === 'RETURNED' ? 'Returned' : 'Return'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Issue Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleDialogClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <IconFileReport size={24} color="#2196f3" />
          <Typography variant="h6" component="span">
            Add Issue Details
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Employee Details Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                Employee Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    required
                    size="small"
                    sx={{ backgroundColor: '#f8f9fa' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Employee Name"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    required
                    size="small"
                    sx={{ backgroundColor: '#f8f9fa' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={newContactNumber}
                    onChange={(e) => setNewContactNumber(e.target.value)}
                    required
                    size="small"
                    sx={{ backgroundColor: '#f8f9fa' }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Items Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                  Issue Items
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setNewItemList([...newItemList, { itemId: 0, itemName: '', serialNumber: '' }])}
                  variant="contained" color="primary"
                >
                  Add Item
                </Button>
              </Box>

              {newItemList.map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={inventoryItems}
                        getOptionLabel={(option) => option.itemName}
                        value={inventoryItems.find(i => i.id === item.itemId) || null}
                        onChange={(_, newValue) => {
                          const updatedItems = [...newItemList];
                          updatedItems[index] = {
                            itemId: newValue?.id || 0,
                            itemName: newValue?.itemName || '',
                            serialNumber: newValue?.serialNo || ''
                          };
                          setNewItemList(updatedItems);
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select Item" 
                            required 
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Serial Number"
                        value={item.serialNumber}
                        disabled
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      {index > 0 && (
                        <IconButton 
                          onClick={() => {
                            const updatedItems = newItemList.filter((_, i) => i !== index);
                            setNewItemList(updatedItems);
                          }}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
          <Button 
            onClick={handleDialogClose}
            variant="contained" 
            sx=
              {{  mr: 1, 
                  backgroundColor: "darkgray", "&:hover": { backgroundColor: "gray" } 
              }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAddIssue} 
            variant="contained" 
            color="primary"
            
          >
            Save Issue
          </Button>
        </DialogActions>
      </Dialog>


      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle>Issue Details</DialogTitle>
        <DialogContent>
          {selectedIssue && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'inline' }}>
                    Employee ID: 
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1, display: 'inline' }}>
                    {selectedIssue.employeeId}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'inline' }}>
                    Employee Name: 
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1, display: 'inline' }}>
                    {selectedIssue.employeeName}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'inline' }}>
                    Contact: 
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1, display: 'inline' }}>
                    {selectedIssue.contact}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'inline' }}>
                    Status: 
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1, display: 'inline' }}>
                    {selectedIssue.status}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Issued Items</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Item Name</b></TableCell>
                      <TableCell><b>Serial Number</b></TableCell>
                      <TableCell><b>Issue Date</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedIssue.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.serialNumber}</TableCell>
                        <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>



      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Issue Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                label="Employee ID"
                variant="outlined"
                fullWidth
                value={newEmployeeId}
                onChange={(e) => setNewEmployeeId(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                label="Employee Name"
                variant="outlined"
                fullWidth
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                label="Contact Number"
                variant="outlined"
                fullWidth
                value={newContactNumber}
                onChange={(e) => setNewContactNumber(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Items in Hand"
                variant="outlined"
                type="number"
                fullWidth
                value={newItemsInHand}
                onChange={(e) => setNewItemsInHand(Number(e.target.value))}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>Edit Item List</Typography>
          {newItemList.map((item, index) => (
            <Box key={index} sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Autocomplete
                    options={inventoryItems}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.itemName
                    }
                    freeSolo
                    value={item.itemName}
                    onChange={(_, newValue) => {
                      handleItemChange(
                        index, 
                        'itemName', 
                        typeof newValue === 'string' ? newValue : newValue || ''
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Item Name"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Serial Number"
                    variant="outlined"
                    fullWidth
                    value={item.serialNumber}
                    onChange={(e) => handleItemChange(index, 'serialNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Issue Date"
                    variant="outlined"
                    type="date"
                    fullWidth
                    value={item.issueDate}
                    onChange={(e) => handleItemChange(index, 'issueDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>


      {/* Return Dialog */}
      <Dialog open={openReturnDialog} onClose={handleDialogClose}>
        <DialogTitle>Return Items</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to return the items?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveReturn} color="primary">Confirm Return</Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default IssueReport;