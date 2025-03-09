import React, { useState } from "react";
import { Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import FilterBar from "./Filter"; // Import FilterBar
import InventoryReportForm from "@/app/(DashboardLayout)/Report/Components/InventoryReportForm"// Assuming this is the table you want to render with filtered data

const InventoryReport: React.FC = () => {
  const [filters, setFilters] = useState<{ item: string, startDate: string, endDate: string, filter: string } | null>(null);

  return (
    <DashboardCard>
      <>
      <Typography variant="h5" fontWeight="bold">
        Inventory Report
      </Typography>
      <FilterBar setFilters={setFilters} /> {/* Pass the setFilters function to FilterBar */}

      {filters && <InventoryReportForm filters={filters} />} {/* Render table only if filters are applied */}
      </>
    </DashboardCard>
  );
};

export default InventoryReport;