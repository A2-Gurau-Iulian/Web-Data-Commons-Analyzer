import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";

export default function TriplesTable({
    triples,
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  }) {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          RDF Triples
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Predicate</strong></TableCell>
              <TableCell><strong>Object</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {triples.map((triple, index) => (
              <TableRow key={index}>
                <TableCell>{triple.subject}</TableCell>
                <TableCell>{triple.predicate}</TableCell>
                <TableCell>{triple.object}</TableCell>
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
  