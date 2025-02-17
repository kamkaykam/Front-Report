import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, CssBaseline, IconButton, Menu, MenuItem } from "@mui/material";
import Filters from "./Filters";
import Charts from "./Charts";
import Tables from "./Tables";
import Map from "./Map";
import Cards from "./Cards";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatCurrency } from "../utils/format";

function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    year: "",
    product: "",
    country: "",
    startDate: "",
    endDate: ""
  });

  const [salesSummary, setSalesSummary] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  // Fetch data from the API
useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem("authToken");

        console.log("🔄 Fetching data with filters:", filters); // ✅ Debug: Ensure filters are updating

        try {
            const [summaryRes, customersRes, countriesRes, forecastRes, productsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/sales/summary", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters, // ✅ Pass filters dynamically
                }),
                axios.get("http://localhost:5000/api/sales/top-customers", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters, // ✅ Pass filters dynamically
                }),
                axios.get("http://localhost:5000/api/sales/top-countries", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters, // ✅ Pass filters dynamically
                }),
                axios.get("http://localhost:5000/api/sales/forecast", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters, // ✅ Pass filters dynamically
                }),
                axios.get("http://localhost:5000/api/products/top", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters, // ✅ Pass filters dynamically
                }),
            ]);

            console.log("✅ API Responses:", {
                salesSummary: summaryRes.data,
                topCustomers: customersRes.data,
                topCountries: countriesRes.data,
                forecast: forecastRes.data,
                topProducts: productsRes.data,
            });

            setSalesSummary(summaryRes.data);
            setTopCustomers([...customersRes.data]);
            setTopCountries([...countriesRes.data]);
            setForecast(forecastRes.data);
            setTopProducts([...productsRes.data]);

        } catch (error) {
            console.error("❌ Error fetching data:", error); // ✅ Properly logs any API errors
        }
    };

    fetchData();
}, [filters]); // ✅ Refetch when filters change




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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
      }}
    >
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#262626" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate("/")}>Dashboard</MenuItem>
            <MenuItem onClick={() => navigate("/ForecastPage")}>Forecast</MenuItem>
            <MenuItem onClick={() => navigate("/customer-products")}>Products Report</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              Logout
            </MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#FFFFFF" }}>
            Sales Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, md: 4 },
          gap: 4,
        }}
      >
        {/* Filters */}
        <Box sx={{ backgroundColor: "#FFFFFF", p: 3, borderRadius: 2, boxShadow: 1 }}>
          <Filters setFilters={setFilters} />
        </Box>

        {/* Summary Cards */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr" }, // ✅ Ensures full width
    gap: 3,
    width: "100%", // ✅ Ensures it stretches across the full row
  }}
>
  <Cards
    salesSummary={salesSummary} // ✅ Pass raw numbers
    forecast={forecast}  // ✅ Ensure forecast data is passed correctly
    topCountries={topCountries}
  />
</Box>



        {/* Charts Section (Line, Pie & Bar Chart) */}
        <Charts filters={filters} />

        {/* Map and Tables */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* Map Section */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Map topCountries={topCountries} />
          </Box>

          {/* Tables Section */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              height: "100%",
              overflow: "auto",
            }}
          >
            <Tables topCustomers={topCustomers} topProducts={topProducts} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
