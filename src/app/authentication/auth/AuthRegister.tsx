"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, Card, Stack, Grid, Alert } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState(""); // Added username state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push("/login");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        const requestBody = { name, username, email, password }; // Include username

        console.log("Submitting with:", requestBody);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map((err: any) => err.message).join(", ");
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || "Registration failed. Please try again.");
            }

            setSuccess(true);
            setError("");
            setName("");
            setUsername(""); // Clear username field
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
                <Grid item xs={12} sm={12} lg={4} xl={3} display="flex" justifyContent="center" alignItems="center">
                    <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
                        <Typography fontWeight="700" variant="h4" mb={1} textAlign="center">
                            Sign Up
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Stack mb={3}>
                                {/* Name Field */}
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">
                                    Name
                                </Typography>
                                <CustomTextField
                                    id="name"
                                    variant="outlined"
                                    fullWidth
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                {/* Username Field */}
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="username" mb="5px" mt="25px">
                                    Username
                                </Typography>
                                <CustomTextField
                                    id="username"
                                    variant="outlined"
                                    fullWidth
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                {/* Email Field */}
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
                                    Email Address
                                </Typography>
                                <CustomTextField
                                    id="email"
                                    variant="outlined"
                                    fullWidth
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    type="email"
                                    required
                                    disabled={loading}
                                />

                                {/* Password Field */}
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
                                    Password
                                </Typography>
                                <CustomTextField
                                    id="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                {/* Confirm Password Field */}
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="confirmPassword" mb="5px" mt="25px">
                                    Confirm Password
                                </Typography>
                                <CustomTextField
                                    id="confirmPassword"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Stack>

                            {/* Display error or success message */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Registration successful! Redirecting...
                                </Alert>
                            )}

                            {/* Submit Button */}
                            <Button
                                color="primary"
                                variant="contained"
                                size="large"
                                fullWidth
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterPage;