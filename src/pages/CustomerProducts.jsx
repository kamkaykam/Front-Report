import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NavigationBar from "../components/Sidebar";  // Adjust path if needed

function CustomerProducts() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    customer_id: [],
    startDate: null,
    endDate: null,
  });
  // ✅ Fetch customers for filter dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomers(response.data);
      } catch (error) {
        console.error("❌ Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);
  // ✅ Fetch filtered data
  const fetchData = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    // ✅ Ensure multiple customer selections are processed correctly
    const customerFilter = filters.customer_id.length
      ? filters.customer_id.join(",")
      : "";
    console.log("🔍 Sending API Request with Filters:", { ...filters, customer_id: customerFilter });
    const response = await axios.get("http://localhost:5000/api/customers/products", {
      headers: { Authorization: `Bearer ${token}` },
      params: { ...filters, customer_id: customerFilter },
    });
    console.log("✅ API Response:", response.data);
    // ✅ Ensure price is always properly formatted for display
    setData(
      response.data.map(row => ({
        ...row,
        product_price: typeof row.product_price === "string" 
          ? row.product_price  // API already formats it
          : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(row.product_price || 0)
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
};
  const handleExport = async (format) => {
  try {
    const token = localStorage.getItem("authToken");
    const customerFilter = filters.customer_id.length ? filters.customer_id.join(",") : "";
    // ✅ Ensure correct date format before sending to API
    const formattedFilters = {
      customer_id: customerFilter,
      startDate: filters.startDate ? filters.startDate.format("YYYY-MM-DD") : null,
      endDate: filters.endDate ? filters.endDate.format("YYYY-MM-DD") : null,
      format
    };
    const response = await axios.get("http://localhost:5000/api/customers/products/export", {
      headers: { Authorization: `Bearer ${token}` },
      params: formattedFilters,
      responseType: "blob",
    });
    // ✅ Handle file download correctly
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Filtered_Customer_Products.${format === "excel" ? "xlsx" : "pdf"}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("❌ Error exporting filtered data:", error);
  }
};
  // ✅ Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <NavigationBar />  {/* ✅ Add the Navigation Bar Here */}
      <Box sx={{ padding: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: 1 }}>

    <Box sx={{ padding: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Customer Products
      </Typography>
      {/* ✅ Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        {/* ✅ Multi-Select Customer Filter */}
        <Select
          multiple
          value={filters.customer_id}
          onChange={(e) => handleFilterChange("customer_id", e.target.value)}
          displayEmpty
          renderValue={(selected) =>
            selected.length === 0 ? "Select Customers" : selected.join(", ")
          }A
          sx={{ minWidth: 200 }}
        >
          {customers.map((customer) => (
            <MenuItem key={customer.customer_id} value={customer.customer_id}>
              {customer.customer_name}
            </MenuItem>
          ))}
        </Select>
        {/* ✅ Date Filters */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date) => handleFilterChange("startDate", date)}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => handleFilterChange("endDate", date)}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={fetchData}>
          Apply Filters
        </Button>
      </Box>
      {/* ✅ Export Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleExport("excel")}>
          Export to Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleExport("pdf")}>
          Export to PDF
        </Button>
      </Box>
      {/* ✅ Data Table */}
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Invoice ID</TableCell>
        <TableCell>Invoice Date</TableCell>
        <TableCell>Customer Name</TableCell>
        <TableCell>Product Name</TableCell>
        <TableCell>Quantity</TableCell>
        <TableCell>Product Price</TableCell>
        <TableCell>Country</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
       {data.length > 0 ? (
    data.map((row, index) => {
      // ✅ List of customer IDs that should be displayed as "ALDI/HOFER"
      const aldiHoferIds = [
        "ALDI (China) Investment Co., Ltd.", "ALDI AHEAD GmbH", "ALDI Australia", "Aldi China", "ALDI Data & Analytics Services GmbH", "ALDI Digital Services Bulgaria EOOD", "ALDI Digital Services GmbH",
        "ALDI Einkauf SE & Co. oHG (ALDI Nord)", "ALDI Global Sourcing Italy S.r.l.", "ALDI Inc.", "ALDI Inc. Corporate Administration", "ALDI International Services SE & Co. oHG", "ALDI S.r.l.", "ALDI Services Asia Limited",
        "ALDI Sourcing Asia Limited", "ALDI Stores (A Limited Partnership)", "ALDI Stores (A Limited Partnership) Prestons Region", "Aldi Stores (Ireland) Limited", "ALDI Stores Ltd", "ALDI SÜD Dienstleistungs-SE & Co. oHG", "ALDI SÜD Financial Services GmbH",
        "ALDI SÜD KG", "ALDI SUISSE AG", "HOFER KG"
      ];
      return (
        <TableRow key={index}>
          <TableCell>{row.invoice_id}</TableCell>
          {/* ✅ Format Invoice Date */}
          <TableCell>{new Date(row.invoice_date).toLocaleDateString("de-DE")}</TableCell>
          {/* ✅ Replace Specific Customer Names with "ALDI/HOFER" if customer_id matches */}
          <TableCell>
            {aldiHoferIds.includes(row.customer_name) ? "ALDI/HOFER" : row.customer_name}
          </TableCell>
          <TableCell>{row.product_name}</TableCell>
          <TableCell>{row.quantity}</TableCell>
          {/* ✅ Fix NaN issue & Format Price in German Currency (€) */}
          <TableCell>{String(row.product_price)}</TableCell>
          <TableCell>{row.country}</TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No Data Available
      </TableCell>
    </TableRow>
  )}
</TableBody>
  </Table>
</TableContainer>
</Box>

        </Box>
    </Box>
  );
}

export default CustomerProducts;
