import React, { useState } from "react";
import { Container, Box, Typography, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Charts = () => {
  const [year, setYear] = useState("all");
  const [chartType, setChartType] = useState("bar");

  const yearlyData = [
    { year: '2009', averageDelay: 12, totalDelays: 500 },
    { year: '2010', averageDelay: 15, totalDelays: 620 },
    { year: '2011', averageDelay: 9, totalDelays: 450 },
    { year: '2012', averageDelay: 14, totalDelays: 580 },
    { year: '2013', averageDelay: 18, totalDelays: 700 },
    { year: '2014', averageDelay: 13, totalDelays: 530 },
    { year: '2015', averageDelay: 20, totalDelays: 760 },
    { year: '2016', averageDelay: 22, totalDelays: 820 },
    { year: '2017', averageDelay: 16, totalDelays: 600 },
    { year: '2018', averageDelay: 19, totalDelays: 650 }
];

  // Filtered data based on selected year
  const filteredData = year === "all" ? yearlyData : yearlyData.filter((d) => d.year === year);

  // Prepare chart data based on filtered data
  const labels = filteredData.map((d) => d.year);
  const averageDelays = filteredData.map((d) => d.averageDelay);
  const totalDelays = filteredData.map((d) => d.totalDelays);

  const barData = {
    labels,
    datasets: [
      {
        label: "Average Delay (minutes)",
        data: averageDelays,
        backgroundColor: averageDelays.map((d) => (d > 15 ? "darkred" : d > 10 ? "orange" : "steelblue")),
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Yearly Delay Trend (minutes)",
        data: averageDelays,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.3,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        label: "Total Delay Distribution",
        data: totalDelays,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FFCD56", "#4BC0C0", "#FFD700", "#ADFF2F"],
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" align="center" marginTop={8} gutterBottom>
        Flight Delay Analysis Dashboard
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mt={8} mb={4} justifyContent="center" >
        <FormControl>
          <InputLabel>Filter by Year</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Filter by Year"
          >
            <MenuItem value="all">All Years</MenuItem>
            {["2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"].map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setChartType("bar")}>Show Bar Chart</Button>
        <Button variant="contained" onClick={() => setChartType("line")}>Show Line Chart</Button>
        <Button variant="contained" onClick={() => setChartType("pie")}>Show Pie Chart</Button>
      </Box>

      {/* Chart Display with custom width and height */}
      <Box display="flex" justifyContent="center">
        {chartType === "bar" && (
          <Box width="100%" maxWidth="800px" mb={8}>
            <Bar data={barData} options={{ maintainAspectRatio: false }} height={400} />
          </Box>
        )}
        {chartType === "line" && (
          <Box width="100%" maxWidth="800px" mb={8}>
            <Line data={lineData} options={{ maintainAspectRatio: false }} height={400} />
          </Box>
        )}
        {chartType === "pie" && (
          <Box width="100%" maxWidth="600px">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} height={800} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Charts;
