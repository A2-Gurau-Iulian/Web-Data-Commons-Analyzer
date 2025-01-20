import React, { useState, useEffect } from 'react';
import { createFileRoute, useMatch, useLocation } from '@tanstack/react-router'

// Route definition
export const Route = createFileRoute('/_layout/classify/categoryDetails')({
  component: CategoryDetails,
})

function CategoryDetails() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const category = params.get('category');  // Access the "category" query parameter
  
  // State to hold search term and fetched results
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce logic (using a timeout)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        fetchResults(searchTerm);
      } else {
        setResults([]); // Clear results when search term is empty
      }
    }, 500); // Wait for 500ms after the user stops typing

    // Cleanup the timeout on each render
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Runs when searchTerm changes

  // Fetch results from the backend using fetch API
  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/category/sparql?category=${category}&query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Assuming response is a JSON array
      // Assuming the response contains results array
      if (data.results) {
        setResults(data.results); // Set the results received from the backend
      } else {
        setResults([]); // No results, so clear the results array
      }
      
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]); // In case of error, clear results
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>Category: {category}</h1>
      <p>This is the details page for the "{category}" category.</p>

      {/* Search Bar */}
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${category}...`}
          style={styles.searchBar}
        />
      </div>

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Display search results */}
      <div style={styles.resultsContainer}>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} style={styles.resultItem}>
              {/* Render each result item */}
              <h3>{result.name}</h3> {/* Adjust this based on your API response */}
              <p>ID:{result.id}</p> {/* Adjust this based on your API response */}
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    textAlign: 'center',
  },
  searchBarContainer: {
    marginBottom: '20px',
  },
  searchBar: {
    width: '300px',
    padding: '10px',
    fontSize: '16px',
  },
  resultsContainer: {
    marginTop: '20px',
  },
  resultItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default CategoryDetails;

