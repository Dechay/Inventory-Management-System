import { Grid, Typography, Box, Skeleton } from "@mui/material";
import { IconBox, IconCheck, IconX, IconCurrencyDollar } from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";

interface Props {
  inventoryData: {
    items: any[];
    categories: any[];
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
  };
  isLoading: boolean;
}

const InventorySummary: React.FC<Props> = ({ inventoryData, isLoading }) => {
  if (isLoading) {
    return (
      <DashboardCard title="Inventory Summary">
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))}
        </Grid>
      </DashboardCard>
    );
  }

  const summaryItems = [
    {
      label: 'Total Items',
      value: inventoryData.totalItems,
      icon: <IconBox stroke={1.5} style={{ color: '#0A7AFF' }} />,
      bgColor: 'rgba(10, 122, 255, 0.1)',
    },
    {
      label: 'In Stock',
      value: inventoryData.items.filter(item => item?.availability === "INSTOCK").length,
      icon: <IconCheck stroke={1.5} style={{ color: '#13DEB9' }} />,
      bgColor: 'rgba(19, 222, 185, 0.1)',
    },
    {
      label: 'Out of Stock',
      value: inventoryData.outOfStockItems,
      icon: <IconX stroke={1.5} style={{ color: '#FA896B' }} />,
      bgColor: 'rgba(250, 137, 107, 0.1)',
    },
    {
      label: 'Total Value',
      value: `Nu. ${inventoryData.totalValue.toFixed(2)}`,
      icon: <IconCurrencyDollar stroke={1.5} style={{ color: '#FFAE1F' }} />,
      bgColor: 'rgba(255, 174, 31, 0.1)',
    }
  ];

  return (
    <DashboardCard title="Inventory Summary">
      <Grid container spacing={3} alignItems="center">
        {summaryItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  backgroundColor: item.bgColor,
                  borderRadius: "8px",
                  width: 48,
                  height: 48,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" fontSize="12px">
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight="600" fontSize="16px">
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </DashboardCard>
  );
};

export default InventorySummary;
