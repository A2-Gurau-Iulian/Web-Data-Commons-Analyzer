import React, { useState, useEffect } from 'react';

function ResultsContainer({ results, loading, onSelect }) {
  // This useEffect monitors changes in `results` and `loading`
  useEffect(() => {
    if (!loading && results.length === 0) {
      onSelect(null); // Call onSelect with null when no results are found
    }
  }, [loading, results, onSelect]); // Dependency array ensures it only runs when these change

  return (
    <div style={styles.resultsContainer}>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        results.map((result, index) => (
          <div
            key={index}
            style={styles.resultItem}
            onClick={() => onSelect(result.id)} // Call onSelect with the item's ID
          >
            <h3>{result.name}</h3>
            <p>ID: {result.id}</p>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
  
const styles = {
  resultsContainer: {
    width: '100%',
    maxHeight: '600px', // Adjust height as needed
    overflowY: 'auto',  // Enables vertical scrolling when content overflows
    marginTop: '20px',
    border: '5px solid rgb(235, 0, 223)',
    padding: '10px',
    borderRadius: '5px',
  },
  resultItem: {
    padding: '10px',
    marginBottom: '10px',
    borderBottom: '1px solid #ccc',
    cursor: 'pointer', // Makes the result item clickable
    // border: '5px solid rgb(230, 255, 1)',
  },
};

export default ResultsContainer;