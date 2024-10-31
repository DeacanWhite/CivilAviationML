import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Grid, TextField, Button, Card, CardContent, IconButton, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Charts from "./pages/Charts";
import About from "./pages/About";

function Home() {
  const flights = [
    { airline: "Qantas", date: "20/09/2024", delay: "15%" },
    { airline: "JetStar Airlines", date: "20/09/2024", delay: "15%" },
    { airline: "JetStar Airlines", date: "20/09/2024", delay: "2%" },
    { airline: "JetStar Airlines", date: "20/09/2024", delay: "55%" },
    { airline: "JetStar Airlines", date: "20/09/2024", delay: "20%" },
    { airline: "JetStar Airlines", date: "20/09/2024", delay: "80%" }
    // Repeat similar objects as needed
  ];

  return (
    <div>
      <Box
        sx={{
          backgroundImage: "url('./Pexels_Photo_by Pixabay.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: "200px 0",
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom>
            Flight Delay Prediction
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingX: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 2,
                padding: "10px 16px",
                maxWidth: "800px",
                width: "100%", // Full width up to 800px max
                flexWrap: "wrap", // Allows items to wrap on smaller screens
                "@media (max-width: 600px)": {
                  flexDirection: "column", // Stack vertically on small screens
                  alignItems: "stretch",
                },
              }}
            >
              <TextField
                label="Departure"
                variant="outlined"
                fullWidth
                sx={{ flex: 1, minWidth: "120px" }}
              />
              <TextField
                label="Arrival"
                variant="outlined"
                fullWidth
                sx={{ flex: 1, minWidth: "120px" }}
              />
              <TextField
                label="Date"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ flex: 1, minWidth: "160px" }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                fullWidth
                sx={{
                  flex: 1,
                  minWidth: "120px",
                  "@media (max-width: 600px)": { marginTop: 2 }, // Add top margin for spacing on smaller screens
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ marginTop: 12 }}>
        <Typography variant="h4" sx={{ marginTop: 4, textAlign: "center" }}>
          Results
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {flights.map((flight, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined" sx={{ display: "flex", justifyContent: "space-between" }}>
                <CardContent>
                  <Typography variant="h6">{flight.airline}</Typography>
                  <Typography>Date: {flight.date}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h6">Delay Probability</Typography>
                  <Typography>{flight.delay}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", color: "black" }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
            Civil Aviation Trend Analyzer
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Typography component={Link} to="/charts" sx={{ textDecoration: "none", color: "inherit" }}>
              Charts
            </Typography>
            <Typography component={Link} to="/about" sx={{ textDecoration: "none", color: "inherit" }}>
              About Us
            </Typography>
          </Box>
          {/* Hamburger Menu Icon for Small Screens */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          {/* Menu for Hamburger */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem component={Link} to="/charts" onClick={handleClose}>Charts</MenuItem>
            <MenuItem component={Link} to="/about" onClick={handleClose}>About Us</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
