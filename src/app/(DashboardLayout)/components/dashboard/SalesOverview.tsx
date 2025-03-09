'use client';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '../shared/DashboardCard';

const SalesOverview = () => {
  const theme = useTheme();
  const [data, setData] = useState<{
    sales: number[];
    purchases: number[];
  }>({
    sales: Array(12).fill(0),
    purchases: Array(12).fill(0)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/overview');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalSales = data.sales.reduce((sum, val) => sum + val, 0);
  const totalPurchases = data.purchases.reduce((sum, val) => sum + val, 0);

  const optionsColumnChart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '42%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: 'butt',
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (value: number) => `Nu.${value.toFixed(0)}`,
      },
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => `Nu.${value.toFixed(2)}`,
      },
    },
  };

  const seriesColumnChart = [
    {
      name: 'Sales',
      data: data.sales,
    },
    {
      name: 'Purchases',
      data: data.purchases,
    },
  ];

  return (
    <DashboardCard title="Sales & Purchase Overview">
      <Grid container spacing={3}>
        {/* Total Sales */}
        <Grid item xs={6} sm={6}>
          <Stack spacing={3} my={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.light', width: 27, height: 27 }}>
                <IconArrowUpLeft width={20} color="#1B884B" />
              </Avatar>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="subtitle2" fontWeight="600">
                  Total Sales
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Nu.{totalSales.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        {/* Total Purchases */}
        <Grid item xs={6} sm={6}>
          <Stack spacing={3} my={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.light', width: 27, height: 27 }}>
                <IconArrowUpLeft width={20} color="#425466" />
              </Avatar>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="subtitle2" fontWeight="600">
                  Total Purchases
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Nu.{totalPurchases.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Chart
        options={optionsColumnChart}
        series={seriesColumnChart}
        type="bar"
        height="370px"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
