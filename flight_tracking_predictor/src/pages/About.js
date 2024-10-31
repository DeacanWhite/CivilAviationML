// src/pages/About.js

import React from "react";
import { Container, Typography, Box, Grid, Avatar } from "@mui/material";

function About() {
  return (
    <Container sx={{ marginTop: 8, paddingBottom: 8 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 4, fontWeight: "bold" }}>
        About Us
      </Typography>

      {/* Introduction Section */}
      <Typography variant="body1" sx={{ textAlign: "center", marginBottom: 4 }}>
        Welcome to the Civil Aviation Trend Analyzer! Our mission is to provide insights into flight delays, pricing trends, and more, helping travelers make informed decisions for a smooth journey.
      </Typography>

      {/* Team or Project Details */}
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "700px", margin: "0 auto" }}>
          The Civil Aviation Trend Analyzer is dedicated to analyzing historical data to predict flight delays, understand pricing trends, and offer valuable insights to improve the travel experience. Our team combines expertise in aviation, data science, and software development to bring you reliable and actionable information.
        </Typography>
      </Box>

      {/* Team Members Section */}
      <Box sx={{ marginTop: 6 }}>
        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 4 }}>
          Meet the Team
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {/* Example Team Member */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar src="https://via.placeholder.com/150" sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>John Doe</Typography>
              <Typography variant="body2" color="textSecondary">Data Scientist</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar src="https://via.placeholder.com/150" sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Jane Smith</Typography>
              <Typography variant="body2" color="textSecondary">Software Engineer</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar src="https://via.placeholder.com/150" sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Jane Doe</Typography>
              <Typography variant="body2" color="textSecondary">Software Engineer</Typography>
            </Box>
          </Grid>
          {/* Add more team members as needed */}
        </Grid>
      </Box>
    </Container>
  );
}

export default About;
