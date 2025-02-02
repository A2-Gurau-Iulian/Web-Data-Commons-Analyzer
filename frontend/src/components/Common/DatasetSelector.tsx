import React, { useEffect, useState } from "react";

export default function DatasetSelector({ selectedDatasets, onChange }) {
  const [datasets, setDatasets] = useState([]); // All available datasets
  const [filteredDatasets, setFilteredDatasets] = useState([]); // Filtered datasets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term

  // Fetch available datasets from the backend
  useEffect(() => {
    async function fetchDatasets() {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/datasets"); // Replace with your backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch datasets");
        }
        const data = await response.json();
        setDatasets(data.datasets);
        setFilteredDatasets(data.datasets); // Initialize filtered datasets
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDatasets();
  }, []);

  // Handle search input changes
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter datasets based on the search term
    const filtered = datasets.filter((dataset) =>
      dataset.toLowerCase().includes(term)
    );
    setFilteredDatasets(filtered);
  };

  // Handle changes in the dataset selection
  const handleDatasetChange = (event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    onChange(selected);
  };

  if (loading) return <div>Loading datasets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto" }}> {/* Set max width */}
      <label htmlFor="dataset-search" style={{ fontWeight: "bold" }}>
        Search Datasets:
      </label>
      <input
        id="dataset-search"
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search datasets..."
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "5px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <div
        id="dataset-selector-container"
        style={{
          width: "100%",
          height: "150px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          padding: "5px",
          borderRadius: "4px",
          border: "none", // Remove visible border
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)", // Optional subtle shadow
        }}
      >
        {filteredDatasets.map((dataset) => (
          <label
            key={dataset}
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              value={dataset}
              checked={selectedDatasets.includes(dataset)}
              onChange={(event) => {
                const selected = event.target.checked
                  ? [...selectedDatasets, dataset]
                  : selectedDatasets.filter((ds) => ds !== dataset);
                onChange(selected);
              }}
              style={{ marginRight: "5px" }}
            />
            {dataset}
          </label>
        ))}
      </div>
    </div>
  );
}
