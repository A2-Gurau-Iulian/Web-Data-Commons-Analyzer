import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import Graph from "@/components/Graph/Graph";
import DatasetSelector from "@/components/Common/DatasetSelector";

export const Route = createFileRoute("/_layout/visualize/graphs")({
  component: GraphPage,
});

function GraphPage() {
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });
  const [selectedDatasets, setSelectedDatasets] = useState([]); // Selected datasets
  const [search, setSearch] = useState(""); // Search term
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGraphData = async () => {
    if (selectedDatasets.length === 0) {
      alert("Please select at least one dataset.");
      return;
    }

    setLoading(true);
    setError(null); // Reset previous errors
    try {
      const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await fetch(
        `http://127.0.0.1:8000/visualize/graph?${datasetParams}${searchParam}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch graph data");
      }

      const data = await response.json();
      setGraphData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      
      {/* Graph Container - Full Screen */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        {/* Graph Visualization */}
        {graphData.nodes.length > 0 && graphData.links.length > 0 ? (
          <Graph graphData={graphData} />
        ) : (
          !loading &&
          !error && <p style={{ color: "white", textAlign: "center", marginTop: "20px" }}>No data to display. Please fetch a graph.</p>
        )}
      </div>

      {/* Right Side: Fixed Dataset Selector & Controls */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 2, background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0px 2px 5px rgba(0,0,0,0.2)", width: "280px" }}>
        
        {/* Dataset Selector */}
        <DatasetSelector
          selectedDatasets={selectedDatasets}
          onChange={setSelectedDatasets}
        />

        {/* Search Filter */}
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="search-input">Search:</label>
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by subject, predicate, or object"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Fetch Graph Button */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            onClick={fetchGraphData}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#007BFF",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Fetch Graph
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default GraphPage;
