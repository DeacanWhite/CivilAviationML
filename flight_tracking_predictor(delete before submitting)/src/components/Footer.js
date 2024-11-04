// src/components/Footer.js
import React from "react";
import { Box, Typography, Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        padding: "40px",
        marginTop: "auto",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Column 1: Website Name */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Civil Aviation Trend Analyzer
          </Typography>
        </Grid>

        {/* Column 2: Emails */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Emails
          </Typography>
          <Typography variant="body2">
            Deacan White:{" "}
            <Link href="mailto:contact@aviationtrend.com" color="inherit" underline="hover">
                103994779@student.swin.edu.au
            </Link>
          </Typography>
          <Typography variant="body2">
            Leanne Kou Zhi Yuan:{" "}
            <Link href="mailto:support@aviationtrend.com" color="inherit" underline="hover">
                104830719@student.swin.edu.au
            </Link>
          </Typography>
          <Typography variant="body2">
            A N M Mushabbir Bashir:{" "}
            <Link href="mailto:info@aviationtrend.com" color="inherit" underline="hover">
                103837722@student.swin.edu.au
            </Link>
          </Typography>
        </Grid>

        {/* Column 3: Additional Links */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Additional Links
          </Typography>
          <Link
            component={RouterLink}
            to="/charts"
            sx={{ display: "block", textDecoration: "none", color: "primary.main", marginBottom: "8px" }}
          >
            Charts
          </Link>
          <Link
            component={RouterLink}
            to="/about"
            sx={{ display: "block", textDecoration: "none", color: "primary.main" }}
          >
            About
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
