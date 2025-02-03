import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";

export default function TriplesTable({
  triples,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  sortBy,
  sortDirection,
  onSort,
}) {
  const handleSort = (field) => {
    onSort(field, sortBy === field && sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}> {/* Force full width */}
      <Typography variant="h6" sx={{ p: 2 }}>
        RDF Triples
      </Typography>
      <Table sx={{ width: "147vh" }}> {/* Ensure table takes full width */}
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === "subject"}
                direction={sortBy === "subject" ? sortDirection : "asc"}
                onClick={() => handleSort("subject")}
              >
                Subject
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "predicate"}
                direction={sortBy === "predicate" ? sortDirection : "asc"}
                onClick={() => handleSort("predicate")}
              >
                Predicate
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "object"}
                direction={sortBy === "object" ? sortDirection : "asc"}
                onClick={() => handleSort("object")}
              >
                Object
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {triples.map((triple, index) => (
    <TableRow key={index}>
      <TableCell style={{ 
        maxWidth: "200px", 
        wordBreak: "break-word", 
        whiteSpace: "normal", 
        overflowWrap: "break-word" 
      }}>
        {triple.subject}
      </TableCell>
      <TableCell style={{ 
        maxWidth: "200px", 
        wordBreak: "break-word", 
        whiteSpace: "normal", 
        overflowWrap: "break-word" 
      }}>
        {triple.predicate}
      </TableCell>
      <TableCell style={{ 
        maxWidth: "200px", 
        wordBreak: "break-word", 
        whiteSpace: "normal", 
        overflowWrap: "break-word" 
      }}>
        {triple.object}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
}
