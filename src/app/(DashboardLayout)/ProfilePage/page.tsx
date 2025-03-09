"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Avatar,
  Paper,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Collapse,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type EditMode = {
  name: boolean;
  email: boolean;
  password: boolean;
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState<EditMode>({
    name: false,
    email: false,
    password: false,
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    currentPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState<string>("/images/profile/user-1.jpg");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          setError('User not logged in');
          return;
        }

        const user = JSON.parse(userData);
        
        // Set initial profile data from localStorage
        setProfileData({
          name: user.name,
          email: user.email,
          username: user.username,
          currentPassword: ''
        });

        // Fetch latest profile data including profile picture
        // const response = await fetch('/api/profile?username=${user.username}');
        // if (!response.ok) throw new Error('Failed to fetch profile');
        
        // const data = await response.json();
        // setProfilePicture(data.profilePicture);
        
        // // Update profile data with latest from server
        // setProfileData(prev => ({
        //   ...prev,
        //   name: data.name,
        //   email: data.email
        // }));
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = (field: "name" | "email") => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          profilePicture,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      alert('Profile updated successfully!');
      setIsEditing({
        name: false,
        email: false,
        password: false,
      });
    } catch (error) {
      alert('Failed to update profile. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match. Please try again.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to change password');
      console.error('Error:', error);
    }
  };

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', profileData.username);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setProfilePicture(data.url);

        // Force a re-render of the Avatar
        const avatar = document.querySelector('img') as HTMLImageElement;
        if (avatar) {
          avatar.src = data.url + '?t=' + new Date().getTime();
        }

        alert('Profile picture updated successfully');
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", mt:-7, padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600, position: "relative" }}>
        <IconButton onClick={() => window.history.back()} sx={{ position: "absolute", top: 8, left: 8 }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar 
            src={profilePicture + '?t=' + new Date().getTime()}
            alt="Profile Picture" 
            sx={{ width: 120, height: 120, marginBottom: 2 }} 
          />
          <input accept="image/*" id="profile-picture-upload" type="file" style={{ display: "none" }} onChange={handlePictureChange} />
          <label htmlFor="profile-picture-upload">
            <Button variant="outlined" component="span" sx={{ mb: 3 }}>
              Edit Picture
            </Button>
          </label>

          <TextField
            fullWidth
            value={profileData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onClick={() => handleEditToggle("name")}
            InputProps={{ readOnly: !isEditing.name }}
            label="Username"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onClick={() => handleEditToggle("email")}
            InputProps={{ readOnly: !isEditing.email }}
            label="Email"
            variant="outlined"
            sx={{ mb: 2 }}
          />


          <Button variant="outlined" fullWidth onClick={() => setShowChangePassword(!showChangePassword)} endIcon={showChangePassword ? <ExpandLessIcon /> : <ExpandMoreIcon />} sx={{ mb: 2 }}>
            Change Password
          </Button>

          <Collapse in={showChangePassword}>
            <TextField fullWidth type="password" label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} sx={{ mb: 2 }} />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField fullWidth type="password" label="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} sx={{ mb: 2 }} />

            <Button variant="contained" color="primary" fullWidth onClick={handleChangePassword} sx={{ mt: 2 }}>
              Save New Password
            </Button>
          </Collapse>

          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 3 }}>
            Save Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;