'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';

const SalesReport = () => {
  return (
    <DashboardCard>
      <Box>
        <Typography variant="h6" gutterBottom>
          Sales Reports
        </Typography>
        {/* Add your sales report implementation here */}
        <Typography>Sales report functionality coming soon...</Typography>
      </Box>
    </DashboardCard>
  );
};

export default SalesReport; 