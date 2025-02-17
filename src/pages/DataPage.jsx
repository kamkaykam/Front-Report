import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  MenuItem,
  Select,
} from "@mui/material";

function DataPage({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnFilters, setColumnFilters] = useState({}); // 🔍 Individual Column Filters

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/products/prices", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/products/prices", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, format },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Product_Prices.${format === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error exporting data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // 🔍 **Apply Global Search & Column Filters**
  const filteredData = data.filter((row) =>
    Object.entries(columnFilters).every(([key, value]) =>
      value ? row[key]?.toString().toLowerCase().includes(value.toLowerCase()) : true
    ) &&
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(globalSearch.toLowerCase())
    )
  );

  // 🔽 **Sort Functionality**
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    return sortConfig.direction === "asc" ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Product Prices Data
      </Typography>

      {/* 🔍 Global Search */}
      <TextField
        label="Search in all columns..."
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setGlobalSearch(e.target.value)}
      />

      {/* 📤 Export Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleExport("excel")}>
          Export to Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleExport("pdf")}>
          Export to PDF
        </Button>
      </Box>

      {/* 📊 Data Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "invoice_id",
                "invoice_date",
                "customer_name",
                "product_name",
                "quantity",
                "product_price",
                "country",
              ].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={sortConfig.key === column}
                    direction={sortConfig.key === column ? sortConfig.direction : "asc"}
                    onClick={() => handleSort(column)}
                  >
                    {column.replace("_", " ").toUpperCase()}
                  </TableSortLabel>

                  {/* 🔽 Column-Specific Filters */}
                  {column === "country" ? (
                    <Select
                      value={columnFilters[column] || ""}
                      onChange={(e) => setColumnFilters({ ...columnFilters, [column]: e.target.value })}
                      displayEmpty
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(data.map((row) => row[column]))].map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                      onChange={(e) => setColumnFilters({ ...columnFilters, [column]: e.target.value })}
                      placeholder={`Search ${column.replace("_", " ")}`}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.invoice_id}</TableCell>
                  <TableCell>{row.invoice_date}</TableCell>
                  <TableCell>{row.customer_name}</TableCell>
                  <TableCell>{row.product_name}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.product_price}</TableCell>
                  <TableCell>{row.country}</TableCell>
                </TableRow>
              ))
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
  );
}

export default DataPage;
