import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme";
import Dashboard from "./components/Dashboard";
import DataPage from "./pages/DataPage";
import CustomerProducts from "./pages/CustomerProducts";
import Login from "./pages/Login";
import ForecastPage from "./pages/ForecastPage"; // ✅ Import the new Forecast Page

function App() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard: Protected Route */}
            <Route
              path="/"
              element={
                token ? (
                  role === "admin" || role === "sales" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/unauthorized" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Data Page */}
            <Route
              path="/data"
              element={token ? <DataPage /> : <Navigate to="/login" />}
            />

            {/* Customer Products Page */}
            <Route
              path="/customer-products"
              element={token ? <CustomerProducts /> : <Navigate to="/login" />}
            />

            {/* ✅ Forecast Page (Protected Route) */}
            <Route
              path="/ForecastPage"
              element={
                token ? (
                  role === "admin" || role === "sales" ? (
                    <ForecastPage />
                  ) : (
                    <Navigate to="/unauthorized" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Unauthorized Access Page */}
            <Route
              path="/unauthorized"
              element={
                <Box sx={{ textAlign: "center", mt: 5 }}>
                  <Typography variant="h4">Access Denied</Typography>
                  <Typography variant="body1">
                    You do not have permission to view this page.
                  </Typography>
                </Box>
              }
            />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
