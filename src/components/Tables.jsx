import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import axios from "axios";
import { formatCurrency } from "../utils/format"; // ✅ Import currency formatter

const Tables = ({ topProducts, topCustomers }) => {
    const handleExport = async (format, type) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("❌ No authentication token found.");
                return;
            }

            const url =
                type === "products"
                    ? `http://localhost:5000/api/products/top?format=${format}`
                    : `http://localhost:5000/api/sales/top-customers?format=${format}`;

            const response = await axios.get(url, {
                responseType: "blob",
                headers: { Authorization: `Bearer ${token}` },
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute(
                "download",
                `${type === "products" ? "Top_Products" : "Top_Customers"}.${format === "excel" ? "xlsx" : "pdf"}`
            );
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("❌ Error exporting data:", error);
        }
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
            {/* 🛍️ Top Selling Products Table */}
            <Box sx={{ backgroundColor: "#FFFFFF", p: 3, borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">🛍️ Top Selling Products</Typography>
                    <Box>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleExport("excel", "products")}
                            sx={{ mr: 1 }}
                        >
                            <FileDownload sx={{ fontSize: 16, mr: 0.5 }} /> Excel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => handleExport("pdf", "products")}
                        >
                            <FileDownload sx={{ fontSize: 16, mr: 0.5 }} /> PDF
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#F4F4F4", textAlign: "left" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Product</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Category</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{product.product_name}</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{product.product_category_name}</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        {formatCurrency(parseFloat(product.total_sales))}
                                    </td> {/* ✅ Correctly formatted */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>

            {/* 🏆 Top Customers Table */}
            <Box sx={{ backgroundColor: "#FFFFFF", p: 3, borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">🏆 Top Customers</Typography>
                    <Box>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleExport("excel", "customers")}
                            sx={{ mr: 1 }}
                        >
                            <FileDownload sx={{ fontSize: 16, mr: 0.5 }} /> Excel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => handleExport("pdf", "customers")}
                        >
                            <FileDownload sx={{ fontSize: 16, mr: 0.5 }} /> PDF
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#F4F4F4", textAlign: "left" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Customer</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Total Spent</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCustomers.map((customer, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{customer.customer_name}</td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        {formatCurrency(parseFloat(customer.total_spent))}
                                    </td> {/* ✅ Correctly formatted */}
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{customer.total_orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    );
};

export default Tables;
