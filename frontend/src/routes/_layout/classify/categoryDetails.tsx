import React, { useState, useEffect, useCallback } from 'react';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import SearchBar from './SearchBar';
import ResultsContainer from './ResultsContainer';
import RightContainer from './RightContainer';

// Route definition
export const Route = createFileRoute('/_layout/classify/categoryDetails')({
  component: CategoryDetails,
});

function CategoryDetails() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // Track selected item

  // Debounce logic for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        fetchResults(searchTerm);
      } else {
        setResults([]); // Clear results when search term is empty
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch results from the backend
  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/category/sparql?category=${category}&query=${query}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data.results || []); // Default to an empty array
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]); // Clear results on error
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Left container */}
      <div style={styles.leftContainer}>
        <h1>Category: {category}</h1>
        <p>This is the details page for the "{category}" category.</p>

        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Results */}
        <ResultsContainer
          results={results}
          loading={loading}
          onSelect={(id: string) => setSelectedItemId(id)} // Pass selected item ID
        />
      </div>

      {/* Right container */}
      <RightContainer category={category} selectedItemId={selectedItemId} />
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    display: 'flex', // Use flexbox to align items side by side
    padding: '20px',
    border: '5px solid rgb(255, 0, 0)',
    height: '800px', // Adjust height as needed
  },
  leftContainer: {
    flex: 0.3, // Takes up remaining space
    marginRight: '20px', // Adds space between left and right container
    border: '5px solid rgb(39, 71, 114)',
    maxHeight: '800px', // Adjust height as needed
  },
};

export default CategoryDetails;
