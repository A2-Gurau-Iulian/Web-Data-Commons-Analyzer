import { createFileRoute } from "@tanstack/react-router";
import GenericChart from "@/components/Chart/GenericChart";
import DatasetSelector from "@/components/Common/DatasetSelector";
import React, { useState, useEffect } from "react";

export const Route = createFileRoute("/_layout/visualize/charts")({
  component: Charts,
});

function Charts() {
  const [chartType, setChartType] = useState("pie");
  const [whatOption, setWhatOption] = useState("Count of");
  const [byOption, setByOption] = useState("Predicate");
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    datasetCount: 0,
    totalRecords: 0,
    uniqueSubjects: 0,
    uniquePredicates: 0,
    uniqueObjects: 0,
    mostConnectedSubject : 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const standaloneOptions = [
    "Distribution of Data Types",
    "Frequency of Predicates",
    "Top Subjects with Most Relations",
    "Top Objects with Most Mentions",
    "Top Predicate-Object Pairs",
  ];

  const fetchStats = async () => {
    if (selectedDatasets.length === 0) return;
    try {
      const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");
      const response = await fetch(`http://127.0.0.1:8000/visualize/stats?${datasetParams}`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const jsonData = await response.json();
      setStats(jsonData);
    } catch (err) {
      setStats({ datasetCount: 0, totalRecords: 0, uniqueSubjects: 0, uniquePredicates: 0, uniqueObjects: 0, mostConnectedSubject: 0 });
      console.error("Stats Fetch Error:", err);
    }
  };

  const truncateText = (text, maxLength = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
  
  const fetchChartData = async () => {
    if (selectedDatasets.length === 0) return;
    try {
      const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");
  
      let url = `http://127.0.0.1:8000/visualize/charts?what=${whatOption}&${datasetParams}`;
      if (!standaloneOptions.includes(whatOption)) {
        url += `&by=${byOption}`;
      }
  
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch chart data");
  
      const jsonData = await response.json();
  
      // Truncate long names in the data before setting state
      const transformedData = jsonData
        .sort((a, b) => b.value - a.value)
        .slice(0, 15)
        .map((item) => ({
          name: truncateText(item.name), // Apply truncation
          value: item.value,
        }))
        .concat([
          {
            name: "Others",
            value: jsonData.slice(15).reduce((sum, item) => sum + item.value, 0),
          },
        ]);
  
      setData(transformedData);
    } catch (err) {
      setError(err.message);
    }
  };
  

  useEffect(() => {
    if (selectedDatasets.length > 0) {
      fetchStats();
      fetchChartData();
    }
  }, [whatOption, byOption, selectedDatasets]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", gap: "1rem" }}>
      
      {/* Statistic Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "1rem" }}>
        {[
          { label: "Number of Datasets", value: stats.datasetCount },
          { label: "Total Records", value: stats.totalRecords },
          { label: "Unique Subjects", value: stats.uniqueSubjects },
          { label: "Unique Predicates", value: stats.uniquePredicates },
          { label: "Unique Objects", value: stats.uniqueObjects },
          { label: "Most Connected Subject", value: stats.mostConnectedSubject || "N/A" },
        ].map((item, index) => (
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
              {item.label}
            </p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#007BFF" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
  
      {/* Chart + Dataset Selector Layout */}
      <div style={{ display: "flex", flex: "1", gap: "1rem", padding: "1rem" }}>
        
        {/* Chart Options & Visualization */}
        <div style={{ flex: "3", padding: "1rem", borderRight: "1px solid #ddd" }}>
        <div style={{ marginBottom: "1rem" }}>
        <label>
          What do you want to see?
          <select value={whatOption} onChange={(e) => setWhatOption(e.target.value)}>
            <option value="Count of">Count of</option>
            <option value="Subjects with the Most Unique Objects">
              Subjects with the Most Unique Objects
            </option>
            <option value="Top Subjects with Most Relations">Top Subjects with Most Relations</option>
            <option value="Top Objects with Most Mentions">Top Objects with Most Mentions</option>
            <option value="Top Predicate-Object Pairs">Top Predicate-Object Pairs</option>
          </select>
        </label>
        {whatOption === "Count of" && (
          <label style={{ marginLeft: "1rem" }}>
            By what?
            <select value={byOption} onChange={(e) => setByOption(e.target.value)}>
              <option value="Predicate">Predicate</option>
              <option value="Subject">Subject</option>
              <option value="Object">Object</option>
            </select>
          </label>
        )}
      </div>
      
  
          {/* Chart Type Selector */}
          <div style={{ marginBottom: "1rem" }}>
            <label><input type="radio" value="pie" checked={chartType === "pie"} onChange={(e) => setChartType(e.target.value)} /> Pie Chart</label>
            <label style={{ marginLeft: "1rem" }}><input type="radio" value="bar" checked={chartType === "bar"} onChange={(e) => setChartType(e.target.value)} /> Bar Chart</label>
            <label style={{ marginLeft: "1rem" }}><input type="radio" value="treemap" checked={chartType === "treemap"} onChange={(e) => setChartType(e.target.value)} /> Treemap Chart</label>
          </div>
  
          {/* Render the chart */}
          <GenericChart key={chartType} title={`Visualization: ${whatOption}`} chartType={chartType} data={data} />
        </div>
  
        {/* Dataset Selector */}
        <div style={{ flex: "1", padding: "1rem", minWidth: "250px" }}>
          <DatasetSelector selectedDatasets={selectedDatasets} onChange={setSelectedDatasets} />
        </div>
      </div>
    </div>
  );  
}  

export default Charts;
