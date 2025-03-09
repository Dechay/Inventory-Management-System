
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import useMenuItems from "./MenuItems"; // Custom hook to get menu items

interface MenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

const SidebarItems = ({ toggleMobileSidebar }: { toggleMobileSidebar: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems: MenuItem[] = useMenuItems(); // Fetch menu items

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleClick = (item: MenuItem) => {
    if (item.onClick) {
      setSelectedItem(item);
      setOpenDialog(true); // Open confirmation dialog for logout
    } else if (item.href) {
      router.push(item.href); // Navigate to the page
      toggleMobileSidebar(); // Close sidebar
    }
  };

  const handleLogoutConfirm = () => {
    if (selectedItem?.onClick) {
      selectedItem.onClick(); // Execute logout function
    }
    setOpenDialog(false); // Close dialog
    toggleMobileSidebar(); // Close sidebar
  };

  return (
    <>
      <Box sx={{ px: 2 }}>
        <List sx={{ pt: 0 }} className="sidebarNav" component="div">
          {menuItems.map((item) => {
            const isSelected = pathname === item.href;

            return (
              <ListItem
                component="div"
                key={item.id}
                onClick={() => handleClick(item)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  px: 5, // Reduced horizontal padding
                  py: 1, // Reduced vertical padding
                  borderRadius: "6px", // Slightly smaller border radius
                  transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  backgroundColor: isSelected ? "#5d87ff" : "transparent",
                  color: isSelected ? "#ffffff" : "#333",
                  "&:hover": {
                    backgroundColor: isSelected ? "#496fdb" : "#c7d8ff", // Darker hover effect
                    color: isSelected ? "#ffffff" : "#000",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? "#ffffff" : "#5d87ff" }}>
                  {React.createElement(item.icon, { size: 22 })} {/* Slightly smaller icon */}
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ fontSize: "14px" }} />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidebarItems;




// **Code before adding highlights**

// import React, { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import useMenuItems from "./MenuItems"; // Use custom hook

// interface MenuItem {
//   id: string;
//   title: string;
//   icon: React.ElementType;
//   href?: string;
//   onClick?: () => void;
// }

// const SidebarItems = ({ toggleMobileSidebar }: { toggleMobileSidebar: () => void }) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const menuItems: MenuItem[] = useMenuItems(); // Call the hook here

//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

//   const handleClick = (item: MenuItem) => {
//     if (item.onClick) {
//       setSelectedItem(item);
//       setOpenDialog(true); // Open confirmation dialog
//     } else if (item.href) {
//       router.push(item.href); // Navigate to the page
//       toggleMobileSidebar(); // Close sidebar
//     }
//   };

//   const handleLogoutConfirm = () => {
//     if (selectedItem?.onClick) {
//       selectedItem.onClick(); // Execute logout function
//     }
//     setOpenDialog(false); // Close dialog
//     toggleMobileSidebar(); // Close sidebar
//   };

//   return (
//     <>
//       <Box sx={{ px: 3 }}>
//         <List sx={{ pt: 0 }} className="sidebarNav" component="div">
//           {menuItems.map((item) => (
//             <ListItem
//               component="div"
//               key={item.id}
//               onClick={() => handleClick(item)}
//               sx={{ cursor: "pointer", display: "flex", alignItems: "center", p: 1.5 }}
//             >
//               <ListItemIcon>{React.createElement(item.icon, { size: 24 })}</ListItemIcon>
//               <ListItemText primary={item.title} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Logout Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Are you sure you want to logout?</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
//           <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default SidebarItems;


