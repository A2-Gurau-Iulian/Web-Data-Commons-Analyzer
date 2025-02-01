import { createFileRoute } from "@tanstack/react-router";
import TriplesTable from "@/components/Table/EntriesTable";
import DatasetSelector from "@/components/Common/DatasetSelector"; // Import the DatasetSelector component
import React, { useEffect, useState } from "react";

export const Route = createFileRoute("/_layout/visualize/records")({
  component: RouteComponent,
});

function RouteComponent() {
  const [triples, setTriples] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("subject");
  const [sortDirection, setSortDirection] = useState("asc");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [predicateFilter, setPredicateFilter] = useState("");
  const [objectFilter, setObjectFilter] = useState("");
  const [selectedDatasets, setSelectedDatasets] = useState([]); // Selected datasets

  // Fetch triples from backend based on user selections
  const fetchTriples = async () => {
    const offset = page * rowsPerPage;
    const limit = rowsPerPage;
    const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/visualize/records?offset=${offset}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}&subjectFilter=${subjectFilter}&predicateFilter=${predicateFilter}&objectFilter=${objectFilter}&${datasetParams}`
      );
      const data = await response.json();
      setTriples(data.triples);
      setCount(data.total);
    } catch (error) {
      console.error("Error fetching triples:", error);
    }
  };

  useEffect(() => {
    if (selectedDatasets.length > 0) {
      fetchTriples();
    }
  }, [page, rowsPerPage, sortBy, sortDirection, subjectFilter, predicateFilter, objectFilter, selectedDatasets]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filterSetter) => (event) => {
    filterSetter(event.target.value);
    setPage(0); // Reset to the first page when a filter changes
  };

  const handleExportJSONLD = async () => {
    if (selectedDatasets.length === 0) {
      alert("Please select at least one dataset before exporting.");
      return;
    }
  
    try {
      const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");
      const filterParams = [
        subjectFilter && `subjectFilter=${encodeURIComponent(subjectFilter)}`,
        predicateFilter && `predicateFilter=${encodeURIComponent(predicateFilter)}`,
        objectFilter && `objectFilter=${encodeURIComponent(objectFilter)}`,
        `sortBy=${sortBy}`,
        `sortDirection=${sortDirection}`,
      ]
        .filter(Boolean)
        .join("&");
  
      const response = await fetch(
        `http://127.0.0.1:8000/visualize/records/export?${datasetParams}&${filterParams}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to export JSON-LD data.");
      }
  
      const jsonData = await response.json();
      const dataStr = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([dataStr], { type: "application/ld+json" });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "triples.jsonld";
  
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting JSON-LD:", error);
    }
  };
  
  const handleExportRDF = async () => {
    if (selectedDatasets.length === 0) {
      alert("Please select at least one dataset before exporting.");
      return;
    }
  
    try {
      const datasetParams = selectedDatasets.map((ds) => `datasets=${ds}`).join("&");
      const filterParams = [
        subjectFilter && `subjectFilter=${encodeURIComponent(subjectFilter)}`,
        predicateFilter && `predicateFilter=${encodeURIComponent(predicateFilter)}`,
        objectFilter && `objectFilter=${encodeURIComponent(objectFilter)}`,
        `sortBy=${sortBy}`,
        `sortDirection=${sortDirection}`,
      ]
        .filter(Boolean)
        .join("&");
  
      const response = await fetch(
        `http://127.0.0.1:8000/visualize/records/export/rdf?${datasetParams}&${filterParams}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to export RDF data.");
      }
  
      const rdfData = await response.text();
      const blob = new Blob([rdfData], { type: "text/turtle" });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "triples.ttl"; // Turtle file extension
  
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting RDF:", error);
    }
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem", padding: "1rem", width: "100vw", overflow: "hidden" }}>
      {/* Left: Records Table and Filters - Takes up remaining space */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        {/* Filter Section */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Filter by Subject"
            value={subjectFilter}
            onChange={handleFilterChange(setSubjectFilter)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Filter by Predicate"
            value={predicateFilter}
            onChange={handleFilterChange(setPredicateFilter)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Filter by Object"
            value={objectFilter}
            onChange={handleFilterChange(setObjectFilter)}
            style={{ flex: 1, padding: "0.5rem" }}
          />
        </div>

        {/* Data Table - Takes up remaining height and full width */}
<div style={{ flex: "1", overflow: "auto", display: "flex", flexDirection: "column", width: "100%", minWidth: "0" }}>
  <TriplesTable
    triples={triples}
    count={count}
    page={page}
    rowsPerPage={rowsPerPage}
    onPageChange={handlePageChange}
    onRowsPerPageChange={handleRowsPerPageChange}
    sortBy={sortBy}
    sortDirection={sortDirection}
    onSort={(field, direction) => {
      setSortBy(field);
      setSortDirection(direction);
      setPage(0);
    }}
  />
</div>

      </div>

      {/* Right: Dataset Selector & Export Button - Fixed width */}
      <div style={{ width: "250px", minWidth: "250px", alignSelf: "start", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <DatasetSelector selectedDatasets={selectedDatasets} onChange={setSelectedDatasets} />
        {/* Export Section */}
        <div>
          <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Export current selection as:</p>
          
          {/* JSON-LD Export Button */}
          <button
            onClick={handleExportJSONLD}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            JSON-LD
          </button>

          {/* RDF Export Button */}
          <button
            onClick={handleExportRDF}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#28A745", // Green color
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            RDF (Turtle)
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteComponent;
