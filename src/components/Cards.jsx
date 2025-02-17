import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { formatCurrency } from "../utils/format"; // ✅ Import helper

function Cards({ salesSummary, forecast, topCountries }) {
  // ✅ Ensure calculations use raw numbers
  const totalSales = salesSummary.reduce((total, item) => total + parseFloat(item.total_sales || 0), 0);
  const totalOrders = salesSummary.reduce((total, item) => total + parseInt(item.total_orders || 0), 0);

  const forecastedSales = forecast && forecast.forecasted_sales
    ? parseFloat(forecast.forecasted_sales) || 0
    : 0; // ✅ Ensure it's a valid number

  const forecastedMonth = forecast && forecast.forecasted_month ? forecast.forecasted_month : "N/A"; // ✅ Get month
  const forecastMethod = forecast && forecast.method_used ? forecast.method_used : "N/A"; // ✅ Get method

  console.log("📊 Forecast Data in Cards:", forecastedSales, forecastedMonth, forecastMethod); // ✅ Debug forecast data

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, // ✅ Ensures full width behavior
        gap: 2, // ✅ Reduced gap for better alignment
        width: "100%", // ✅ Ensures full row usage
        justifyContent: "center", // ✅ Centers grid if fewer than 4 items
      }}
    >
      {/* ✅ Total Sales Card */}
      <Card sx={{ backgroundColor: "#FFA321", color: "white", textAlign: "center", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Total Sales</Typography>
          <Typography variant="h5">{formatCurrency(totalSales)}</Typography> {/* ✅ Format only for display */}
        </CardContent>
      </Card>

      {/* ✅ Total Orders Card */}
      <Card sx={{ backgroundColor: "#1D3944", color: "white", textAlign: "center", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Total Orders</Typography>
          <Typography variant="h5">{totalOrders.toLocaleString()}</Typography>
        </CardContent>
      </Card>

      {/* ✅ Top Country by Sales */}
      <Card sx={{ backgroundColor: "#262626", color: "white", textAlign: "center", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Top Country</Typography>
          <Typography variant="h5">
            {topCountries.length > 0 ? topCountries[0].country : "N/A"}
          </Typography>
        </CardContent>
      </Card>

      {/* ✅ Forecasted Sales Card */}
      <Card sx={{ backgroundColor: "#0B6E4F", color: "white", textAlign: "center", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Forecasted Sales</Typography>
          <Typography variant="h5">{formatCurrency(forecastedSales)}</Typography> {/* ✅ Format only for display */}
          <Typography variant="body2" sx={{ mt: 1 }}>📅 Month: {forecastedMonth}</Typography> {/* ✅ Display forecasted month */}
          <Typography variant="body2">📊 Method: {forecastMethod}</Typography> {/* ✅ Display forecast method */}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Cards;
