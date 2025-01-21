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
  const [additionalInfo , setAdditionalInfo] = useState([]);
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

  // New function to fetch additional info for a clicked result
const fetchAdditionalInfo = async (id: string) => {
  setLoading(true);
  try {
    const response = await fetch(`http://127.0.0.1:8000/item/${id}`); // Adjust this API endpoint to fetch additional data
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setAdditionalInfo(data); // Assuming data contains the additional information
  } catch (error) {
    console.error('Error fetching additional info:', error);
    setAdditionalInfo([]); // In case of error, clear additional info
  }
  setLoading(false);
};

  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
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
              <div
                key={index}
                style={styles.resultItem}
                onClick={() => fetchAdditionalInfo(result.id)} // Fetch additional info on click
              >
                <h3>{result.name}</h3>
                <p>ID:{result.id}</p>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>

      {/* Right container for additional information */}
      <div style={styles.rightContainer}>
        {loading ? (
          <p>Loading additional info...</p>
        ) : additionalInfo ? (
          <div>
            <h2>Additional Info</h2>
            <p>{additionalInfo.details}</p> {/* Adjust based on the API response */}
          </div>
        ) : (
          <p>No additional information available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    display: 'flex', // Use flexbox to align items side by side
    padding: '20px',
    border: '5px solid rgb(255, 0, 0)',
  },
  leftContainer: {
    flex: 0.3, // Takes up remaining space
    marginRight: '20px', // Adds space between left and right container
    border: '5px solid rgb(39, 71, 114)',
  },
  searchBarContainer: {
    width: '100%',
    marginBottom: '20px',
    border: '5px solid rgb(111, 184, 77)',
  },
  searchBar: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
  },
  resultsContainer: {
    width: '100%',
    maxHeight: '500px', // Adjust height as needed
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
    border: '5px solid rgb(230, 255, 1)',
  },
  rightContainer: {
    flex: 0.7, // Adjust width of right container
    // height: '500px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default CategoryDetails;

