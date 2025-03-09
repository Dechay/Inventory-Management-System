"use client";
import { Grid, Box } from "@mui/material";
import { useState } from "react";
import PageContainer from "../components/container/PageContainer";
import InventorySummary from "../components/dashboard/InventorySummary";
import Buttons from "../components/inventoryelement/buttons";
import InventoryTable from "../components/inventoryelement/itemtable";
import { useInventoryData } from "@/hooks/useInventoryData";

const Inventory = () => {
  const { inventoryData, isLoading, refreshData } = useInventoryData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByCategory, setFilterByCategory] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterCategory = (categoryId: string) => {
    setFilterByCategory(categoryId);
  };

  const handleFilterAvailability = (status: string) => {
    setAvailability(status);
  };

  return (
    <PageContainer title="Inventory" description="Inventory Management">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InventorySummary 
              inventoryData={inventoryData} 
              isLoading={isLoading} 
            />
          </Grid>
          <Grid item xs={12}>
            <Buttons 
              inventoryData={inventoryData} 
              onItemAdded={refreshData}
              onSearch={handleSearch}
              onFilterCategory={handleFilterCategory}
              onFilterAvailability={handleFilterAvailability}
            />
          </Grid>
          <Grid item xs={12}>
            <InventoryTable 
              inventoryData={inventoryData?.items || []}
              searchQuery={searchQuery}
              filterByCategory={filterByCategory}
              availability={availability}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Inventory;
