import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <div style={styles.searchBarContainer}>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
      style={styles.searchBar}
    />
  </div>
);

const styles = {
  searchBarContainer: {
    width: '100%',
    marginBottom: '20px',
    // border: '5px solid rgb(111, 184, 77)',
  },
  searchBar: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
  },
};

export default SearchBar;