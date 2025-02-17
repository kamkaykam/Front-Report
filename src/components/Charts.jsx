import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import axios from "axios";

function Charts({ filters }) {
  const [salesData, setSalesData] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const [salesRes, countriesRes, productsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sales/summary", {
            headers: { Authorization: `Bearer ${token}` },
            params: filters,
          }),
          axios.get("http://localhost:5000/api/sales/top-countries", {
            headers: { Authorization: `Bearer ${token}` },
            params: filters,
          }),
          axios.get("http://localhost:5000/api/products/top", {
            headers: { Authorization: `Bearer ${token}` },
            params: filters,
          }),
        ]);

        // ✅ Ensure Sales Data is Sorted in Ascending Order (Oldest to Newest)
const sortedSalesData = salesRes.data
  .map((item) => {
    const rawMonth = String(item.invoice_year_month); // Ensure it's a string
    const parts = rawMonth.split("."); // Split "02.2025" → ["02", "2025"]
    const formattedMonth = `${parts[1]}-${parts[0]}`; // Convert to "2025-02"

    return {
      month: formattedMonth, // ✅ Ensure correct format "YYYY-MM"
      sales: parseFloat(item.total_sales.replace(/[^\d,-]/g, "").replace(",", ".")) || 0, // ✅ Convert properly
      dateObj: new Date(`${parts[1]}-${parts[0]}-01`) // ✅ Create a valid date object for sorting
    };
  })
  .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); // ✅ Ensure chronological sorting



        setSalesData(sortedSalesData);

        // ✅ Format Data for Pie Chart (Sales by Country)
       setTopCountries(
  countriesRes.data.map((item) => ({
    country: item.country,
    total_sales: parseFloat(item.total_sales.replace(/[^\d,-]/g, "").replace(",", ".")) || 0, // ✅ Convert properly
  }))
);

setTopProducts(
  productsRes.data.map((item) => ({
    product_name: item.product_name,
    total_sales: parseFloat(item.total_sales.replace(/[^\d,-]/g, "").replace(",", ".")) || 0, // ✅ Convert properly
  }))
);

        // ✅ Format Data for Bar Chart (Top Selling Products)
        setTopProducts(
          productsRes.data.map((item) => ({
            product_name: item.product_name,
            total_sales: parseFloat(item.total_sales),
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [filters]);

  // ✅ Export Charts as Excel or PDF
  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      const url = `http://localhost:5000/api/export/charts?format=${format}`;
      const response = await axios.get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `Sales_Chart.${format === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("❌ Error exporting chart:", error);
    }
  };

  const COLORS = ["#FFA321", "#1D3944", "#262626", "#999999", "#D9D9D9"];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: "#FFFFFF",
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* ✅ Export Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">📊 Sales Charts</Typography>
        <Box>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleExport("excel")}
            sx={{ mr: 1 }}
          >
            <FileDownload sx={{ fontSize: 16, mr: 0.5 }} /> Excel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => handleExport("pdf")}
          >
            <FileDownload sx={{ fontSize: 16, mr: 0.5 }} /> PDF
          </Button>
        </Box>
      </Box>

      {/* ✅ Line Chart (Sales Trend Over Time) */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Sales Trend Over Time</Typography>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" 
              tickFormatter={(tick) => tick.split("-").reverse().join(".")} // ✅ Convert "2025-02" → "02.2025"
               reversed={false}/>
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#FFA321" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </Box>

      {/* ✅ Two Charts in One Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {/* 📊 Pie Chart (Sales by Country) */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Sales by Country</Typography>
          {topCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCountries}
                  dataKey="total_sales"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {topCountries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography>No Data Available</Typography>
          )}
        </Box>

        {/* 📉 Bar Chart (Top Selling Products) */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Top Selling Products</Typography>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#FFA321" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography>No Data Available</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Charts;
