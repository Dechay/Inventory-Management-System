"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, Typography, Button, CircularProgress, Card, Stack, Grid, Alert } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";
import Image from "next/image";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const imageSrc = "/images/logos/Logo.png";

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push("/authentication/login");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate inputs
        if (!name || !username || !email || !password || !confirmPassword) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            setSuccess(true);
            setError("");
            
            // Clear form
            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            // Redirect to login page after short delay
            setTimeout(() => {
                router.push("/authentication/login");
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Registration failed");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
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
            <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
                <Grid item xs={12} sm={12} lg={4} xl={3} display="flex" justifyContent="center" alignItems="center">
                    <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <Image
                                src={imageSrc}
                                alt="Logo"
                                width={185}
                                height={50}
                                priority
                            />
                        </Box>

                        <Typography fontWeight="700" variant="h3" mb={1} textAlign="center">
                            Sign Up
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Registration successful! Redirecting to login...
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <CustomTextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    disabled={loading}
                                />
                                <CustomTextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    value={username}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    disabled={loading}
                                />
                                <CustomTextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                                <CustomTextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <CustomTextField
                                    label="Confirm Password"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </Stack>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Sign Up"}
                            </Button>

                            <Typography textAlign="center" mt={2}>
                                Already have an account?{" "}
                                <Typography
                                    component="a"
                                    href="/authentication/login"
                                    sx={{ textDecoration: "none", color: "primary.main" }}
                                >
                                    Sign In
                                </Typography>
                            </Typography>
                        </form>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterPage;