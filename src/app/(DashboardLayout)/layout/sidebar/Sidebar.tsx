"use client";

import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Sidebar } from "react-mui-sidebar";
import { usePathname } from "next/navigation";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: () => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const pathname = usePathname();

  const sidebarWidth = "270px";

  // Custom CSS for short scrollbar
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  const imageSrc = "/images/logos/Logo.png";

  const renderLogo = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={2}
      mb={3}
    >
      <img
        src={imageSrc}
        alt="Sidebar Logo"
        style={{
          width: "185px",
          height: "50px",
        }}
      />
    </Box>
  );

  // Don't display the sidebar on the profile page
  if (pathname === "/ProfilePage") {
    return null;
  }

  if (lgUp) {
    return (
      <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: { boxSizing: "border-box", ...scrollbarStyles },
          }}
        >
          <Box sx={{ height: "100%" }}>
            <Sidebar
              width={"270px"}
              collapsewidth="80px"
              open={isSidebarOpen}
              themeColor="#5d87ff"
              themeSecondaryColor="#49beff"
              showProfile={false}
            >
              {renderLogo()}
              <Box>
                <SidebarItems toggleMobileSidebar={onSidebarClose} />
              </Box>
            </Sidebar>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{ sx: { boxShadow: (theme) => theme.shadows[8], ...scrollbarStyles } }}
    >
      <Box px={2}>
        <Sidebar
          width={"270px"}
          collapsewidth="80px"
          isCollapse={false}
          mode="light"
          direction="ltr"
          themeColor="#5d87ff"
          themeSecondaryColor="#49beff"
          showProfile={false}
        >
          {renderLogo()}
          <SidebarItems toggleMobileSidebar={onSidebarClose} />
        </Sidebar>
      </Box>
    </Drawer>
  );
};

export default MSidebar;
