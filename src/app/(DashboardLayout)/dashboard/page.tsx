"use client";
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import InventorySummary from '@/app/(DashboardLayout)/components/dashboard/InventorySummary';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useEffect } from 'react';

const Dashboard = () => {
  const { inventoryData, isLoading, error, refreshData } = useInventoryData();

  // Add debugging logs
  useEffect(() => {
    console.log("Dashboard: Current inventory data:", {
      count: inventoryData.length,
      isLoading,
      error,
      sampleItem: inventoryData[0]
    });
  }, [inventoryData, isLoading, error]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* Inventory Summary */}
          <Grid item xs={12}>
            <InventorySummary 
              inventoryData={inventoryData} 
              isLoading={isLoading}
            />
          </Grid>

          {/* Other dashboard components */}
          <Grid item xs={12}>
            {/* Your other dashboard content */}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard; 