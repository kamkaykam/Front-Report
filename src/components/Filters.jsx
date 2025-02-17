import React, { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import axios from "axios";

function Filters({ setFilters }) {
  const [yearOptions, setYearOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    year: "",
    product: "",
    country: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const [summaryRes, productsRes, countriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sales/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/sales/top-countries", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setYearOptions([...new Set(summaryRes.data.map((item) => item.invoice_year))]);
        setProductOptions(productsRes.data.map((item) => ({ label: item.product_name, value: item.product_id })));
        setCountryOptions(countriesRes.data.map((item) => ({ label: item.country, value: item.country })));
      } catch (error) {
        console.error("❌ Error fetching filter data:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleApplyFilters = () => {
    console.log("🔄 Applying filters:", selectedFilters); // ✅ Debugging
    setFilters(selectedFilters);
};

  const handleResetFilters = () => {
    setSelectedFilters({ year: "", product: "", country: "", startDate: "", endDate: "" });
    setFilters({ year: "", product: "", country: "", startDate: "", endDate: "" });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "repeat(6, 1fr)" },
        gap: 2,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 2,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <TextField select label="Year" value={selectedFilters.year} onChange={(e) => setSelectedFilters({ ...selectedFilters, year: e.target.value })}>
        {yearOptions.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>

      <TextField select label="Product" value={selectedFilters.product} onChange={(e) => setSelectedFilters({ ...selectedFilters, product: e.target.value })}>
        {productOptions.map((product) => (
          <MenuItem key={product.value} value={product.value}>
            {product.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField select label="Country" value={selectedFilters.country} onChange={(e) => setSelectedFilters({ ...selectedFilters, country: e.target.value })}>
        {countryOptions.map((country) => (
          <MenuItem key={country.value} value={country.value}>
            {country.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField type="date" label="Start Date" InputLabelProps={{ shrink: true }} value={selectedFilters.startDate} onChange={(e) => setSelectedFilters({ ...selectedFilters, startDate: e.target.value })} />

      <TextField type="date" label="End Date" InputLabelProps={{ shrink: true }} value={selectedFilters.endDate} onChange={(e) => setSelectedFilters({ ...selectedFilters, endDate: e.target.value })} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}

export default Filters;
