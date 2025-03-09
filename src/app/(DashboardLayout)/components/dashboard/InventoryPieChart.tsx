"use client";
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Typography, CircularProgress } from '@mui/material';
import DashboardCard from '../shared/DashboardCard';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Item {
  id: number;
  categoryId: number;
  quantity: number;
  price: number;
  category: {
    name: string;
  };
}

interface InventoryPieChartProps {
  data: Item[];
}

const InventoryPieChart = ({ data }: InventoryPieChartProps) => {
  // Calculate category totals and value
  const categoryData = data.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Uncategorized';
    const value = item.quantity * item.price;
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        quantity: 0,
        value: 0
      };
    }
    
    acc[categoryName].quantity += item.quantity;
    acc[categoryName].value += value;
    
    return acc;
  }, {} as Record<string, { quantity: number; value: number }>);

  // Prepare data for the pie chart
  const categories = Object.keys(categoryData);
  const values = categories.map(cat => categoryData[cat].value);
  const quantities = categories.map(cat => categoryData[cat].quantity);

  // Generate colors
  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360; // Use golden angle approximation
      colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
    }
    return colors;
  };

  const backgroundColors = generateColors(categories.length);

  const chartData = {
    labels: categories.map(cat => `${cat} (${categoryData[cat].quantity} items)`),
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12
          },
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, i: number) => ({
              text: `${label} - Nu.${values[i].toFixed(2)}`,
              fillStyle: datasets[0].backgroundColor[i],
              hidden: false,
              lineCap: undefined,
              lineDash: undefined,
              lineDashOffset: undefined,
              lineJoin: undefined,
              lineWidth: undefined,
              strokeStyle: datasets[0].backgroundColor[i],
              pointStyle: undefined,
              rotation: undefined,
              index: i
            }));
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const categoryName = categories[context.dataIndex];
            const value = values[context.dataIndex];
            const quantity = quantities[context.dataIndex];
            return [
              `Category: ${categoryName}`,
              `Value: Nu.${value.toFixed(2)}`,
              `Quantity: ${quantity} items`
            ];
          }
        }
      }
    },
  };

  if (!data || data.length === 0) {
    return (
      <DashboardCard title="Inventory Distribution">
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <Typography variant="subtitle1" color="textSecondary">
            No inventory data available
          </Typography>
        </Box>
      </DashboardCard>
    );
  }

  const totalValue = values.reduce((sum, val) => sum + val, 0);
  const totalItems = quantities.reduce((sum, val) => sum + val, 0);

  return (
    <DashboardCard title="Inventory Distribution">
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Total Value: Nu.{totalValue.toFixed(2)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Total Items: {totalItems}
          </Typography>
        </Box>
        <Pie data={chartData} options={options} />
      </Box>
    </DashboardCard>
  );
};

export default InventoryPieChart;
