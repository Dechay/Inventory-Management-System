'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { Visibility } from '@mui/icons-material';

interface IssueItem {
  id: string;
  itemId: number;
  itemName: string;
  serialNumber: string;
  issueDate: string;
  returnDate: string | null;
  status: string;
}

interface ReturnIssue {
  id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  status: string;
  items: IssueItem[];
}

const ReturnReport = () => {
  const [returnedIssues, setReturnedIssues] = useState<ReturnIssue[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnIssue | null>(null);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/issues/returns');
      if (!response.ok) {
        throw new Error('Failed to fetch returns');
      }
      const data = await response.json();
      setReturnedIssues(data.data);
    } catch (error) {
      console.error('Error fetching returns:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleEditClick = (index: number, currentValue: string) => {
    setEditIndex(index);
    setEditValue(currentValue);
  };

  const handleSaveClick = async (issueId: string, itemId: number) => {
    try {
      const response = await fetch(`/api/issues/returns/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          returnDate: new Date().toISOString() // Use current date as return date
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update return date');
      }

      setEditIndex(null);
      fetchReturns(); // Refresh the data
      alert('Return date updated successfully');
    } catch (error) {
      console.error('Error updating return:', error);
      alert('Failed to update return date');
    }
  };

  const handleViewClick = (issue: ReturnIssue) => {
    setSelectedReturn(issue);
    setOpenViewDialog(true);
  };

  const handleDialogClose = () => {
    setOpenViewDialog(false);
    setSelectedReturn(null);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Return Report
      </Typography>
      {returnedIssues.length === 0 ? (
        <Typography>No return records found.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Employee ID</b></TableCell>
                <TableCell><b>Employee Name</b></TableCell>
                <TableCell><b>Contact</b></TableCell>
                <TableCell><b>Item Name</b></TableCell>
                <TableCell><b>Serial Number</b></TableCell>
                <TableCell><b>Issue Date</b></TableCell>
                <TableCell><b>Return Date</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returnedIssues.map((issue, issueIndex) =>
                issue.items.map((item, itemIndex) => {
                  const currentIndex = issueIndex * issue.items.length + itemIndex;
                  return (
                    <TableRow key={`${issueIndex}-${itemIndex}`}>
                      <TableCell>{issue.employeeId}</TableCell>
                      <TableCell>{issue.employeeName}</TableCell>
                      <TableCell>{issue.contact}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.serialNumber}</TableCell>
                      <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editIndex === currentIndex ? (
                          <Box display="flex" alignItems="center">
                            <TextField
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              size="small"
                              sx={{ marginRight: 1 }}
                            />
                            <IconButton onClick={() => handleSaveClick(issue.id, item.itemId)}>
                              <CheckIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ marginRight: 1 }}>
                              {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <IconButton onClick={() => handleEditClick(currentIndex, item.returnDate || '')}>
                              <EditIcon />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => handleViewClick(issue)}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          Return Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedReturn && (
            <Box>
              <Grid container spacing={3}>
                {/* Employee Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                    Employee Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Employee ID</Typography>
                      <Typography variant="body1">{selectedReturn.employeeId}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Employee Name</Typography>
                      <Typography variant="body1">{selectedReturn.employeeName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Contact</Typography>
                      <Typography variant="body1">{selectedReturn.contact}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Items Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 500 }}>
                    Returned Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Item Name</b></TableCell>
                          <TableCell><b>Serial Number</b></TableCell>
                          <TableCell><b>Issue Date</b></TableCell>
                          <TableCell><b>Return Date</b></TableCell>
                          <TableCell><b>Status</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedReturn.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.serialNumber}</TableCell>
                            <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Typography 
                                color={item.status === 'RETURNED' ? 'success.main' : 'warning.main'}
                              >
                                {item.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
          <Button onClick={handleDialogClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReturnReport;