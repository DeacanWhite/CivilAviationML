import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Grid, TextField, Button, Card, CardContent, IconButton, Menu, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Charts from "./pages/Charts";
import About from "./pages/About";
import "./App.css";
import Footer from "./components/Footer";
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
  
  const handleSearch = async () => {
    try {
        const submitResponse = await axios.post("http://127.0.0.1:8000/submit", {
            airline,
            origin: departure,
            destination: arrival,
            flight_date: date,
            planned_depart_time: plannedDepartTime.replace(":", ""),
        });

        console.log("Submit Response:", submitResponse.data); // Log the entire submit response

        const predictionId = submitResponse.data.id;
        console.log("Prediction ID:", predictionId);

        // Call the predict endpoint
        const predictResponse = await axios.post(`http://127.0.0.1:8000/predict/${predictionId}`);
        console.log("Predict Response:", predictResponse.data);

        let resultStatus = "processing";
        while (resultStatus === "processing") {
            const resultResponse = await axios.get(`http://127.0.0.1:8000/result/${predictionId}`);
            resultStatus = resultResponse.data.status;
            console.log("Result Status:", resultStatus);

            if (resultStatus === "failed") {
                console.error("Data processing or prediction failed.");
                return;
            }

            if (resultStatus === "prediction complete") {
                console.log("Result Data:", resultResponse.data); // Check if delay is included
                
                setFlights([{ ...resultResponse.data.result, airline, date, plannedDepartTime, delayProbability: resultResponse.data.result.delay_probability }]);
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Poll every second
        }
    } catch (error) {
        console.error("Error fetching flight data:", error);
    }
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
                  <MenuItem value="ORD">O'Hare International Airport</MenuItem>
                  <MenuItem value="ATL">Hartsfield-Jackson Atlanta International Airport</MenuItem>
                  <MenuItem value="DFW">Dallas/Fort Worth International Airport</MenuItem>
                  <MenuItem value="DEN">Denver International Airport</MenuItem>
                  <MenuItem value="JFK">John F. Kennedy International Airport</MenuItem>
                  <MenuItem value="SFO">San Francisco International Airport</MenuItem>
                  <MenuItem value="SEA">Seattle-Tacoma International Airport</MenuItem>
                  <MenuItem value="LAS">McCarran International Airport</MenuItem>
                  <MenuItem value="MCO">Orlando International Airport</MenuItem>
                  <MenuItem value="CLT">Charlotte Douglas International Airport</MenuItem>
                  <MenuItem value="PHX">Phoenix Sky Harbor International Airport</MenuItem>
                  <MenuItem value="IAH">George Bush Intercontinental Airport</MenuItem>
                  <MenuItem value="MIA">Miami International Airport</MenuItem>
                  <MenuItem value="BOS">Boston Logan International Airport</MenuItem>
                  <MenuItem value="MSP">Minneapolis–Saint Paul International Airport</MenuItem>
                  <MenuItem value="DTW">Detroit Metropolitan Airport</MenuItem>
                  <MenuItem value="PHL">Philadelphia International Airport</MenuItem>
                  <MenuItem value="BWI">Baltimore/Washington International Airport</MenuItem>
                  <MenuItem value="SLC">Salt Lake City International Airport</MenuItem>
                </Select>
              </FormControl>

              {/* Arrival Dropdown */}
              <FormControl fullWidth sx={{ flex: 1, minWidth: "120px" }}>
                <InputLabel>Arrival</InputLabel>
                <Select value={arrival} onChange={handleArrivalChange} label="Arrival" aria-label="Select arrival location">
                  <MenuItem value="ORD">O'Hare International Airport</MenuItem>
                  <MenuItem value="ATL">Hartsfield-Jackson Atlanta International Airport</MenuItem>
                  <MenuItem value="DFW">Dallas/Fort Worth International Airport</MenuItem>
                  <MenuItem value="DEN">Denver International Airport</MenuItem>
                  <MenuItem value="JFK">John F. Kennedy International Airport</MenuItem>
                  <MenuItem value="SFO">San Francisco International Airport</MenuItem>
                  <MenuItem value="SEA">Seattle-Tacoma International Airport</MenuItem>
                  <MenuItem value="LAS">McCarran International Airport</MenuItem>
                  <MenuItem value="MCO">Orlando International Airport</MenuItem>
                  <MenuItem value="CLT">Charlotte Douglas International Airport</MenuItem>
                  <MenuItem value="PHX">Phoenix Sky Harbor International Airport</MenuItem>
                  <MenuItem value="IAH">George Bush Intercontinental Airport</MenuItem>
                  <MenuItem value="MIA">Miami International Airport</MenuItem>
                  <MenuItem value="BOS">Boston Logan International Airport</MenuItem>
                  <MenuItem value="MSP">Minneapolis–Saint Paul International Airport</MenuItem>
                  <MenuItem value="DTW">Detroit Metropolitan Airport</MenuItem>
                  <MenuItem value="PHL">Philadelphia International Airport</MenuItem>
                  <MenuItem value="BWI">Baltimore/Washington International Airport</MenuItem>
                  <MenuItem value="SLC">Salt Lake City International Airport</MenuItem>
                </Select>
              </FormControl>

              {/* Date Picker */}
              <TextField label="Date" variant="outlined" type="date" InputLabelProps={{ shrink: true }} fullWidth value={date} onChange={handleDateChange} sx={{ flex: 1, minWidth: "160px" }} aria-label="Select departure date" />
              
              {/* Airline Dropdown */}
              <FormControl fullWidth sx={{ flex: 1, minWidth: "120px" }}>
                <InputLabel>Airline</InputLabel>
                <Select value={airline} onChange={handleAirlineChange} label="Airline" aria-label="Select airline">
                  <MenuItem value="OO">SkyWest Airlines</MenuItem>
                  <MenuItem value="AA">American Airlines</MenuItem>
                  <MenuItem value="US">US Airways</MenuItem>
                  <MenuItem value="WN">Southwest Airlines</MenuItem>
                  <MenuItem value="DL">Delta Air Lines</MenuItem>
                  <MenuItem value="EV">ExpressJet Airlines</MenuItem>
                  <MenuItem value="AS">Alaska Airlines</MenuItem>
                  <MenuItem value="VX">Virgin America</MenuItem>
                  <MenuItem value="B6">JetBlue Airways</MenuItem>
                  <MenuItem value="UA">United Airlines</MenuItem>
                  <MenuItem value="F9">Frontier Airlines</MenuItem>
                  <MenuItem value="NK">Spirit Airlines</MenuItem>
                  <MenuItem value="G4">Allegiant Air</MenuItem>
                  <MenuItem value="HA">Hawaiian Airlines</MenuItem>
                  <MenuItem value="MQ">Envoy Air</MenuItem>
                  <MenuItem value="YX">Republic Airways</MenuItem>
                  <MenuItem value="OH">PSA Airlines</MenuItem>
                  <MenuItem value="9E">Endeavor Air</MenuItem>
                  <MenuItem value="CP">Compass Airlines</MenuItem>
                  <MenuItem value="ZW">Air Wisconsin</MenuItem>
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
        <Grid
          container
          spacing={2}
          sx={{ marginTop: 2, justifyContent: "center", alignItems: "center" }}
        >
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
                  <Typography>{flight.delayProbability.toFixed(2)}%</Typography>
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
      <div
        // Apply flexbox styles to the main container
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
      }}
      >
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

        {/* Footer */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;
