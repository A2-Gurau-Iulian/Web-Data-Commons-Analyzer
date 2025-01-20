import { createFileRoute } from "@tanstack/react-router";
import TriplesTable from "@/components/Table/EntriesTable";
import React, { useEffect, useState } from "react";

export const Route = createFileRoute("/_layout/visualize/records")({
  component: RouteComponent,
});

function RouteComponent() {
  const [triples, setTriples] = useState([]); // Store the triples data
  const [count, setCount] = useState(0); // Store the total number of records
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  // Fetch data from backend API
  const fetchTriples = async (page: number, rowsPerPage: number) => {
    const offset = page * rowsPerPage;
    const limit = rowsPerPage;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/visualize/records?offset=${offset}&limit=${limit}`
      );
      const data = await response.json();
      setTriples(data.triples);
      setCount(data.total); // Total number of records
    } catch (error) {
      console.error("Error fetching triples:", error);
    }
  };

  // Fetch data when the page or rowsPerPage changes
  useEffect(() => {
    fetchTriples(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <div>
      <TriplesTable
        triples={triples}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}
