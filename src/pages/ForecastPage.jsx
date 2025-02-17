import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [method, setMethod] = useState("moving_average");
  const [loading, setLoading] = useState(false);
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

  // ✅ Fetch Historical & Forecast Data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      // ✅ Fetch historical data for all available years
      const historicalResponse = await axios.get(
        `http://localhost:5000/api/sales/summary/all-years`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Fetch forecast data (expecting multiple months for 2025)
      const forecastResponse = await axios.get(
        `http://localhost:5000/api/sales/forecast`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { method },
        }
      );

      console.log("📊 API Responses:", {
        historical: historicalResponse.data,
        forecast: forecastResponse.data,
      });

      setHistoricalData(
        Array.isArray(historicalResponse.data) ? historicalResponse.data : []
      );

      // ✅ Ensure forecastData is always an array
      setForecastData(
        Array.isArray(forecastResponse.data)
          ? forecastResponse.data
          : [forecastResponse.data]
      );

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setHistoricalData([]);
      setForecastData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [method]);

  // ✅ Transform Data to Display by Month (01–12) and Group by Year
  const transformedData = {};

  // ✅ Add Historical Data First
  historicalData.forEach((entry) => {
    const [month, year] = entry.invoice_year_month.split(".");
    if (!transformedData[month]) transformedData[month] = { month };
    transformedData[month][year] = entry.total_sales;
  });

  // ✅ Add Forecast Data (2025 Forecasted Sales as a Separate Line)
  forecastData.forEach((entry) => {
    const [year, month] = entry.forecasted_month.split("-"); // Convert YYYY-MM to MM
    if (!transformedData[month]) transformedData[month] = { month };

    // ✅ Store forecast separately as "2025 Forecast"
    transformedData[month]["2025 Forecast"] = entry.forecasted_sales;
  });

  // Convert to array format for Recharts & Sort Months Correctly
  const chartData = Object.values(transformedData).sort(
    (a, b) => parseInt(a.month) - parseInt(b.month)
  );

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

      {/* ✅ Navigation Bar */}
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
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/");
              }}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/forecast");
              }}
            >
              Forecast
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/customer-products");
              }}
            >
              Products Report
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
              sx={{ color: "red" }}
            >
              Logout
            </MenuItem>
          </Menu>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#FFFFFF" }}
          >
            Sales Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ✅ Main Content */}
      <Box sx={{ p: 4, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          📈 Sales Forecasting & Analysis
        </Typography>

        {/* ✅ Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="moving_average">Moving Average</MenuItem>
            <MenuItem value="linear_regression">Linear Regression</MenuItem>
            <MenuItem value="exponential_smoothing">
              Exponential Smoothing
            </MenuItem>
            <MenuItem value="arima">ARIMA (AI-Based)</MenuItem>
            <MenuItem value="lstm">LSTM AI Model</MenuItem>
          </Select>

          <Button variant="contained" onClick={fetchAllData}>
            🔍 Refresh Data
          </Button>
        </Box>

        {/* 📊 Line Chart (Comparing Each Year’s Sales by Month) */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📊 Sales Trend (Yearly Comparison by Month)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="2021" stroke="#8884d8" name="2021 Sales" />
              <Line type="monotone" dataKey="2022" stroke="#82ca9d" name="2022 Sales" />
              <Line type="monotone" dataKey="2023" stroke="#ff7300" name="2023 Sales" />
              <Line type="monotone" dataKey="2024" stroke="#ff0000" name="2024 Sales" />
              <Line type="monotone" dataKey="2025" stroke="#00bcd4" name="2025 Sales" />
              <Line type="monotone" dataKey="2025 Forecast" stroke="#FFA321" strokeDasharray="5 5" name="2025 Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ForecastPage;
