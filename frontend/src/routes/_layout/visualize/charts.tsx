import { createFileRoute } from "@tanstack/react-router";
import GenericChart from "@/components/Chart/GenericChart";
import DatasetSelector from "@/components/Common/DatasetSelector"; // Import DatasetSelector
import React, { useState, useEffect } from "react";

export const Route = createFileRoute("/_layout/visualize/charts")({
  component: Charts,
});

function Charts() {
  const [chartType, setChartType] = useState("pie"); // Default to pie chart
  const [whatOption, setWhatOption] = useState("Count of"); // "What do you want to see?"
  const [byOption, setByOption] = useState("Predicate"); // "By what?"
  const [selectedDatasets, setSelectedDatasets] = useState([]); // User-selected datasets
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend based on selected options and datasets
  const fetchChartData = async () => {
    if (selectedDatasets.length === 0) return;

    try {
      const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");
      const response = await fetch(
        `http://127.0.0.1:8000/visualize/charts?what=${whatOption}&by=${byOption}&${datasetParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const jsonData = await response.json();

      // Transform the data to limit to top 10 entries and aggregate others
      const transformedData = jsonData
        .sort((a, b) => b.value - a.value) // Sort by value descending
        .slice(0, 15) // Take top 15 items
        .concat([
          {
            name: "Others",
            value: jsonData.slice(15).reduce((sum, item) => sum + item.value, 0), // Sum remaining values
          },
        ]);

      setData(transformedData); // Use transformed data for the chart
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch chart data when options or datasets change
  useEffect(() => {
    if (selectedDatasets.length > 0) {
      fetchChartData();
    }
  }, [whatOption, byOption, selectedDatasets]);

  const handleWhatChange = (event) => {
    setWhatOption(event.target.value);
  };

  const handleByChange = (event) => {
    setByOption(event.target.value);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", gap: "1rem" }}>
      
      {/* Top Section: Statistic Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "1rem" }}>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            style={{
              flex: "1",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              minWidth: "260px",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {["Number of Datasets", "Total Records", "Filtered Records", "Unique Subjects", "Unique Predicates", "Unique Objects"][index]}
            </p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#007BFF" }}>0</p> {/* Replace with dynamic values */}
          </div>
        ))}
      </div>
  
      {/* Bottom Section: Main Layout (Chart + Dataset Selector) */}
      <div style={{ display: "flex", flex: "1", gap: "1rem", padding: "1rem" }}>
        
        {/* Left Side: Chart Options and Visualization */}
        <div style={{ flex: "3", padding: "1rem", borderRight: "1px solid #ddd" }}>
          {/* Options for "What" and "By" */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              What do you want to see?
              <select value={whatOption} onChange={handleWhatChange}>
                <option value="Count of">Count of</option>
              </select>
            </label>
            <label style={{ marginLeft: "1rem" }}>
              By what?
              <select value={byOption} onChange={handleByChange}>
                <option value="Predicate">Predicate</option>
                <option value="Subject">Subject</option>
                <option value="Object">Object</option>
              </select>
            </label>
          </div>
  
          {/* Chart Type Selector */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              <input
                type="radio"
                value="pie"
                checked={chartType === "pie"}
                onChange={handleChartTypeChange}
              />
              Pie Chart
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                value="bar"
                checked={chartType === "bar"}
                onChange={handleChartTypeChange}
              />
              Bar Chart
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                value="treemap"
                checked={chartType === "treemap"}
                onChange={handleChartTypeChange}
              />
              Treemap Chart
            </label>
          </div>
  
          {/* Render the chart */}
          <GenericChart
            key={chartType} // Forces re-render when the chart type changes
            title={`Visualization: ${whatOption} by ${byOption}`}
            chartType={chartType}
            data={data}
          />
        </div>
  
        {/* Right Side: Dataset Selector */}
        <div style={{ flex: "1", padding: "1rem", minWidth: "250px" }}>
          <DatasetSelector
            selectedDatasets={selectedDatasets}
            onChange={setSelectedDatasets}
          />
        </div>
      </div>
    </div>
  );  
}  

export default Charts;
