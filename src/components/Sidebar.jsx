import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#262626" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/"); }}>Dashboard</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/forecast"); }}>Forecast</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/customer-products"); }}>Products Report</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }} sx={{ color: "red" }}>Logout</MenuItem>
        </Menu>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#FFFFFF" }}>
          Sales Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
