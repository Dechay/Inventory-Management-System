'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import InventorySummary from './components/dashboard/InventorySummary';
import InventoryPieChart from './components/dashboard/InventoryPieChart';
import SalesOverview from './components/dashboard/SalesOverview';
import { useInventoryData } from '@/hooks/useInventoryData';

const Dashboard = () => {
  const { inventoryData, isLoading } = useInventoryData();

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
          {/* Sales & Purchase Chart */}
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          {/* Inventory Pie Chart */}
          <Grid item xs={12} lg={4}>
            {!isLoading && <InventoryPieChart data={inventoryData.items.map(item => ({
              ...item,
              category: { name: String(item.categoryId) || 'Uncategorized' }
            }))} />}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;

