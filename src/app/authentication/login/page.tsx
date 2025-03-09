"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box, Card, Stack, Typography, Alert } from "@mui/material";
import Image from "next/image";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthLogin from "../auth/AuthLogin";

const Login2 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const imageSrc = "/images/logos/Logo.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Login" description="This is the login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={imageSrc}
                  alt="Logo"
                  width={185}
                  height={50}
                  priority
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <AuthLogin
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                loading={loading}
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="textSecondary" variant="h6" fontWeight="500">
                      New to NewEdge?
                    </Typography>
                    <Typography
                      component="a"
                      href="/authentication/register"
                      fontWeight="500"
                      sx={{ textDecoration: "none", color: "primary.main" }}
                    >
                      Create an account
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;