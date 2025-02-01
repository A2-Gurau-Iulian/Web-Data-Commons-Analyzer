import React, { useState, useEffect, useCallback } from 'react';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import SearchBar from '@/components/Classify/SearchBar';
import ResultsContainer from '@/components/Classify/ResultsContainer';
import RightContainer from '@/components/Classify/RightContainer';
import BottomRightPopup from '@/components/Classify/ComparePopup';
import ComparisonTable from '@/components/Classify/ComparisonTable';

const categories = [
  "Administrative Area", "Airport", "Book", "City", "College or University", "Country", "Creative Work", "Data Set", 
  "Educational Organization", "Event", "Geo Coordinates", "Government Organization", "Hospital", "Hotel", "Job Posting", "Lake Body of Water", 
  "Landmarks or Historical Buildings", "Language", "Library", "Local Business", "Mountain", "Movie", "Museum", 
  "Music Album", "Music Recording", "Painting", "Park", "Place", "Product", "Question", 
  "Radio Station", "Recipe", "Restaurant", "River Body of Water", "School", "Shopping Center", "Ski Resort", 
  "Sports Event", "Sports Team", "Stadium or Arena", "Television Station", "TV Episode"
];

// Route definition
export const Route = createFileRoute('/_layout/classify/categoryDetails')({
  component: CategoryDetails,
});

function CategoryDetails() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  const backgroundImage = params.get('backgroundImage');

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const [compareLists, setCompareLists] = useState({});
  const [isMainCategory, setIsMainCategory] = useState(false);
  const [tableCategory, setTableCategory] = useState('');
  
  // States for "Similarities based on country"
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [idList, setIdList] = useState<string[]>([]);
  const [isLoadingIds, setIsLoadingIds] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Load compareList from localStorage when the component mounts
  useEffect(() => {
    const savedCompareList = localStorage.getItem('compareList');
    if (savedCompareList) {
      const local_storage = JSON.parse(savedCompareList);
      if (Object.keys(local_storage).length > 0){
        setCompareLists(JSON.parse(savedCompareList));
      }
    }
  }, []);

  // Save compareList to localStorage whenever it changes
  useEffect(() => {
    setCompareList(compareLists[category]);
    localStorage.setItem('compareList', JSON.stringify(compareLists));
  }, [compareLists]);

  // Debounce logic for search
  useEffect(() => {
    setSelectedCategory(category);
    setIsMainCategory(true);
    console.log("search bar", category, true);
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
      const response = await fetch(`http://127.0.0.1:8000/category/sparql?category=${selectedCategory}&query=${query}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data.results || []); // Default to an empty array
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]); // Clear results on error
    }
    setLoading(false);
  };

  const addToCompare = (info, category) => {
    setCompareLists((prevLists) => {
      const currentList = prevLists[category] || []; // Get the current list for the category or initialize as empty
  
      // Prevent duplicate additions
      const exists = currentList.some(
        (item) => JSON.stringify(item) === JSON.stringify(info)
      );
  
      if (currentList.length < 5 && !exists) {
        return {
          ...prevLists,
          [category]: [...currentList, info], // Add the new item to the specific category
        };
      }
  
      return prevLists; // If no change, return the previous state
    });
  };

  const handleCompare = (category, list) => {
    console.log(`Comparing items for category: ${category}`, list);
    // Logic to display the comparison popup for the specific category
    console.log(compareLists[category]);
    setCompareList(compareLists[category]);
    setTableCategory(category);
    setIsComparisonOpen(true);
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    setIsMainCategory(false);
    console.log("select bar", selectedCategory, false);
    // Call the API when a category is selected
    setIsLoadingIds(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/similarities/sparql?category=${selectedCategory}`);
      const data = await response.json();
      setIdList(data.ids); // Assuming the API returns an object with an 'ids' array
      // console.log(idList);
    } catch (error) {
      console.error('Error fetching IDs:', error);
      setIdList([]);
    }
    setIsLoadingIds(false);
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
          onSelect={(id: string) => {setSelectedItemId(id); // Pass selected item ID
            if(id != null){
              setIsMainCategory(true); setSelectedCategory(category); setIdList([]); console.log("results container", true, category, []);}
            }
          } 
        />
      </div>

      {/* Right container */}
      <RightContainer category={selectedCategory} selectedItemId={selectedItemId} addToCompare={addToCompare} backgroundImage={backgroundImage} isMainCategory={isMainCategory} />

      {/* Bottom Right Popup */}
      <div style={styles.Popup}>
        {Object.entries(compareLists).map(([category, list]) => (
          <BottomRightPopup
            key={category}
            compareList={list}
            removeFromCompare={(itemIndex) => {
              setCompareLists((prevLists) => {
                const updatedList = [...prevLists[category]];
                updatedList.splice(itemIndex, 1); // Remove the item by index
                return { ...prevLists, [category]: updatedList };
              });
            }}
            onCompare={() => handleCompare(category, list)}
            category={category}
          />
        ))}
      </div>

      {isComparisonOpen && (
        <ComparisonTable
          compareList={compareList}
          tableCategory = {tableCategory}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}
      
      {/* Similarities based on country section */}
      <div style={styles.similaritiesContainer}>
        <h3>Similarities based on country</h3>
        
        {/* Select category */}
        <select value={selectedCategory} onChange={handleCategoryChange} style={styles.select}>
          <option value="">Select a category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Display the IDs */}
        {isLoadingIds ? (
          <p>Fetching similar items...</p> // Custom loading message
        ) : idList.length === 0 ? (
          <p>No similarities found.</p> // Message when the list is empty
        ) : (
          <ul>
            {idList.map((id) => (
              <li key={id} onClick={() => {setSelectedItemId(id); setIsMainCategory(false); setSelectedCategory(selectedCategory);}} style={styles.idItem}>
                {id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  Popup: {
    display: 'flex',
    justifyContent: 'space-around',
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    alignItems: 'flex-end',
    zIndex: 1000
  },
  container: {
    width: '100%',
    display: 'flex',
    padding: '20px',
    height: '800px',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.3,
    marginRight: '20px',
    maxHeight: '100%',
  },
  similaritiesContainer: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  select: {
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  idItem: {
    cursor: 'pointer',
    padding: '5px 0',
    borderBottom: '1px solid #eee',
  },
};

export default CategoryDetails;
