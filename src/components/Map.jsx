import React from "react";
import { Box, Typography } from "@mui/material";
import { WorldMap } from "react-svg-worldmap";

function Map({ topCountries }) {
  const formattedData = topCountries.map((item) => ({
    country: item.country,
    value: parseFloat(item.total_sales),
  }));

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>🌍 Sales by Country</Typography>
      {formattedData.length > 0 ? (
        <WorldMap color="blue" valueSuffix="€" size="responsive" data={formattedData} />
      ) : (
        <Typography>No Data Available</Typography>
      )}
    </Box>
  );
}

export default Map;
