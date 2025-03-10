"use client";

import { styled, Container, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Prevents flashing
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname.startsWith("/authentication/login");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token && !isLoginPage) {
      router.replace("/authentication/login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoading) return <div>Loading...</div>; // ✅ Prevent blank screen while checking auth

  return (
    <MainWrapper className="mainwrapper">
      {!isLoginPage && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}
      <PageWrapper className="page-wrapper">
        {!isLoginPage && <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />}
        <Container sx={{ paddingTop: "20px", maxWidth: "1200px" }}>
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
