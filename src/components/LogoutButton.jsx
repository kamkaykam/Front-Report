import React from "react";
import { Button } from "@mui/material";

function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <Button color="error" variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
