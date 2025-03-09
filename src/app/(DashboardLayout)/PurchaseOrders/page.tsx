'use client'; // This page uses client-side state

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Paper,
  Button
} from '@mui/material';
import PurchaseOrderForm from './Component/forms';
import PageContainer from '../components/container/PageContainer';
import { Add as AddIcon } from '@mui/icons-material';

const PurchaseOrder = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveOrder = async (orderData: any) => {
    try {
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <PageContainer title="Purchase Orders" description="Manage purchase orders">
      <Box display="flex" justifyContent="space-between" alignItems="center">
          <Paper >
              <Box >
                <PurchaseOrderForm 
                  onSave={handleSaveOrder}
                  onCancel={() => setIsFormOpen(false)}
                />
              </Box>
            </Paper>
          
        </Box>
    </PageContainer>
  );
};

export default PurchaseOrder;


// 'use client'; // This page uses client-side state

// import React, { useState } from "react";
// import { 
//   Box, 
//   Typography, 
//   Paper,
//   Button
// } from '@mui/material';
// import PurchaseOrderForm from './Component/forms';
// import PageContainer from '../components/container/PageContainer';
// import { Add as AddIcon } from '@mui/icons-material';

// const PurchaseOrder = () => {
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const handleSaveOrder = async (orderData: any) => {
//     try {
//       setIsFormOpen(false);
//     } catch (error) {
//       console.error('Error saving order:', error);
//     }
//   };

//   return (
//     <PageContainer title="Purchase Orders" description="Manage purchase orders">
//       <Box p={3}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h4">Purchase Orders</Typography>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setIsFormOpen(true)}
//           >
//             New Purchase Order
//           </Button>
//         </Box>

//         {isFormOpen && (
//           <Box mb={4}>
//             <Paper elevation={3}>
//               <Box p={3}>
//                 <PurchaseOrderForm 
//                   onSave={handleSaveOrder}
//                   onCancel={() => setIsFormOpen(false)}
//                 />
//               </Box>
//             </Paper>
//           </Box>
//         )}
//       </Box>
//     </PageContainer>
//   );
// };

// export default PurchaseOrder;