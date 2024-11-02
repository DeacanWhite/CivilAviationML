import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Grid, TextField, Button, Card, CardContent, IconButton, Menu, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Charts from "./pages/Charts";
import About from "./pages/About";
import "./App.css";
import BackToTopButton from "./components/BackToTopButton";

function Home() {
  // State for fade-in animation
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Add the visible class after the component mounts
    setVisible(true);
  }, []);

  // State for search inputs
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [airline, setAirline] = useState("");
  const [plannedDepartTime, setPlannedDepartTime] = useState("");
  const [flights, setFlights] = useState([]); // Holds flight data from API response

  // Handler functions for updating search input values
  const handleDepartureChange = (e) => setDeparture(e.target.value);
  const handleArrivalChange = (e) => setArrival(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleAirlineChange = (e) => setAirline(e.target.value);
  const handlePlannedDepartTimeChange = (e) => setPlannedDepartTime(e.target.value);

  // Function to fetch data from the API based on search parameters
  /*
  const handleSearch = async () => {
    try {
      // Sends a POST request to the API endpoint with search criteria
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        departure,
        arrival,
        date,
        airline,
        plannedDepartTime,
      });

      // Update flights state with the API response data
      setFlights(response.data.flights); // Assumes API returns data in { flights: [...] } format
    } catch (error) {
      console.error("Error fetching flight data:", error);
    }
  };
  */

  // Mock data to simulate an API response
  // Uncomment the code above to test the UI without the API

  const handleSearch = async () => {
      const mockResponse = {
        flights: [
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" },
          { airline: "Qantas", date: "20/09/2024", plannedDepartTime: "08:00", delay: "15%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "JetStar Airlines", date: "21/09/2024", plannedDepartTime: "09:30", delay: "2%" },
          { airline: "Virgin Australia", date: "22/09/2024", plannedDepartTime: "10:15", delay: "25%" }
        ]
      };

      // Simulate an API call delay
      setTimeout(() => {
        setFlights(mockResponse.flights);
      }, 1000); // 1-second delay to mimic API response time
    };


  return (
    <div>
      {/* Background Section with Title */}
      <Box sx={{ backgroundImage: "url('./Pexels_Photo_by Pixabay.png')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", textAlign: "center", padding: "200px 0" }}>
        <Container>
          <Typography variant="h2" gutterBottom>
            Flight Delay Prediction
          </Typography>

          {/* Search Bar */}
            <Box
              className={`fade-in ${visible ? "visible" : ""}`} // Apply fade-in and visible classes
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingX: 2 }}
            >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 2, padding: "16px 16px", maxWidth: "800px", width: "100%", flexWrap: "wrap", "@media (max-width: 600px)": { flexDirection: "column", alignItems: "stretch" } }}>
              
              {/* Departure Dropdown */}
              <FormControl fullWidth sx={{ flex: 1, minWidth: "120px" }}>
                <InputLabel>Departure</InputLabel>
                <Select value={departure} onChange={handleDepartureChange} label="Departure" aria-label="Select departure location">
                  <MenuItem value="Sydney">Sydney</MenuItem>
                  <MenuItem value="Melbourne">Melbourne</MenuItem>
                  <MenuItem value="Brisbane">Brisbane</MenuItem>
                  <MenuItem value="Perth">Perth</MenuItem>
                  <MenuItem value="Adelaide">Adelaide</MenuItem>
                </Select>
              </FormControl>

              {/* Arrival Dropdown */}
              <FormControl fullWidth sx={{ flex: 1, minWidth: "120px" }}>
                <InputLabel>Arrival</InputLabel>
                <Select value={arrival} onChange={handleArrivalChange} label="Arrival" aria-label="Select arrival location">
                  <MenuItem value="Sydney">Sydney</MenuItem>
                  <MenuItem value="Melbourne">Melbourne</MenuItem>
                  <MenuItem value="Brisbane">Brisbane</MenuItem>
                  <MenuItem value="Perth">Perth</MenuItem>
                  <MenuItem value="Adelaide">Adelaide</MenuItem>
                </Select>
              </FormControl>

              {/* Date Picker */}
              <TextField label="Date" variant="outlined" type="date" InputLabelProps={{ shrink: true }} fullWidth value={date} onChange={handleDateChange} sx={{ flex: 1, minWidth: "160px" }} aria-label="Select departure date" />
              
              {/* Airline Dropdown */}
              <FormControl fullWidth sx={{ flex: 1, minWidth: "120px" }}>
                <InputLabel>Airline</InputLabel>
                <Select value={airline} onChange={handleAirlineChange} label="Airline" aria-label="Select airline">
                  <MenuItem value="Qantas">Qantas</MenuItem>
                  <MenuItem value="JetStar">JetStar</MenuItem>
                  <MenuItem value="Virgin Australia">Virgin Australia</MenuItem>
                  <MenuItem value="Air New Zealand">Air New Zealand</MenuItem>
                </Select>
              </FormControl>

              {/* Planned Departure Time */}
              <TextField label="Planned Depart Time" variant="outlined" type="time" InputLabelProps={{ shrink: true }} fullWidth value={plannedDepartTime} onChange={handlePlannedDepartTimeChange} sx={{ flex: 1, minWidth: "120px" }} aria-label="Select planned departure time" />

              {/* Search Button - Initiates API Request */}
              <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleSearch} fullWidth sx={{ flex: 1, minWidth: "120px", "@media (max-width: 600px)": { marginTop: 2 } }} aria-label="Search flights">
                Search
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Results Section - Displays API Response */}
      <Container sx={{ marginTop: 12, marginBottom: 12 }}>
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
                  <Typography>Planned Departure: {flight.plannedDepartTime}</Typography>
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

  // State for managing the navigation menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <AppBar position="static" sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", color: "black" }}>
          <Toolbar>
            {/* Home Link */}
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
            <IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{ display: { xs: "flex", md: "none" } }} onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
            {/* Dropdown Menu for Smaller Screens */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem component={Link} to="/charts" onClick={handleClose}>Charts</MenuItem>
              <MenuItem component={Link} to="/about" onClick={handleClose}>About Us</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Routing for Pages */}
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Box>

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>
    </Router>
  );
}

export default App;
