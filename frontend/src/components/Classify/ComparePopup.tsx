import React, { useState } from 'react';

const BottomRightPopup = ({
  compareList,
  removeFromCompare,
  onCompare,
  category,
}) => {
  const [isMinimized, setIsMinimized] = useState(false); // State to track if the popup is minimized

  const toggleMinimize = () => {
    setIsMinimized((prevState) => !prevState); // Toggle minimize state
  };

  return (
    compareList.length > 0 && (
      <div
        style={{
          ...styles.popupContainer,
          ...(isMinimized ? styles.minimizedContainer : {}),
        }}
      >
        {/* Header with Minimize Button */}
        <div style={styles.popupHeader}>
          <h3 style={styles.popupHeaderText}>{category} Compare List</h3>
          <button onClick={toggleMinimize} style={styles.minimizeButton}>
            {isMinimized ? '+' : '-'}
          </button>
        </div>
  
        {/* Content (hidden if minimized) */}
        {!isMinimized && (
          <>
            <ul style={styles.popupList}>
              {compareList.map((item, index) => (
                <li key={index} style={styles.popupListItem}>
                  {/* Display only the "name" attribute */}
                  {item.find((info) => info.attribute === 'name')?.value || 'Unnamed'}
                  <button
                    onClick={() => removeFromCompare(index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={onCompare}
              style={styles.compareButton}
              disabled={compareList.length < 2}
            >
              Compare
            </button>
          </>
        )}
      </div>
    )
  );
};

const styles = {
  popupContainer: {
    // border: '5px solid rgb(0, 17, 255)',
    // position: 'relative',
    margin: '5px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '300px',
    // height: '400px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 1)',
    transition: 'height 0.3s ease, width 0.3s ease', // Smooth transition for minimize/maximize
  },
  minimizedContainer: {
    height: '35px', // Reduce height when minimized
    overflow: 'hidden', // Hide contents
    padding: '5px', // Smaller padding
    width: '150px', // Shrink width when minimized
    bottom: 0
  },
  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popupHeaderText: {
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap', // Prevent header text from wrapping or overflowing
    flex: 1, // Allow text to take remaining space
  },
  minimizeButton: {
    background: 'transparent',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginLeft: '10px', // Add spacing between the button and the text
    flexShrink: 0, // Prevent the button from shrinking
  },
  popupList: {
    overflowY: 'auto',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    maxHeight: '400px',
  },
  popupListItem: {
    border: '1px solid rgb(136, 136, 138)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    margin: '5px',
  },
  removeButton: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 8px',
    cursor: 'pointer',
  },
  compareButton: {
    // border: '5px solid rgb(136, 255, 0)',
    marginTop: '10px',
    background: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default BottomRightPopup;
