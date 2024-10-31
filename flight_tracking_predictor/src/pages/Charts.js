// src/pages/Charts.js

import React from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";

function Charts() {
  return (
    <Container sx={{ marginTop: 8, paddingBottom: 8 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 4, fontWeight: "bold" }}>
        Charts and Analytics
      </Typography>

      {/* Description */}
      <Typography variant="body1" sx={{ textAlign: "center", marginBottom: 6 }}>
        Explore insightful data visualizations on flight trends, delay probabilities, pricing patterns, and more. Our charts are designed to help you make informed travel decisions.
      </Typography>

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* Example Chart Area 1 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Flight Delay Probability
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Placeholder for a chart */}
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 12 }}>
                Chart Placeholder
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Example Chart Area 2 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Price Trends Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Placeholder for a chart */}
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 12 }}>
                Chart Placeholder
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Example Chart Area 3 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Airline Performance Comparison
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Placeholder for a chart */}
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 12 }}>
                Chart Placeholder
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Example Chart Area 4 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Seasonal Delay Patterns
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Placeholder for a chart */}
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 12 }}>
                Chart Placeholder
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Charts;

