import React from 'react';

const BottomRightPopup = ({
  compareList,
  removeFromCompare,
  onCompare,
}) => {
  return (
    <div style={styles.popupContainer}>
      <h3>Compare List</h3>
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
      {compareList.length > 0 && (
        <button onClick={onCompare} style={styles.compareButton} disabled={compareList.length < 2}>
          Compare
        </button>
      )}
    </div>
  );
};

const styles = {
    popupContainer: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      width: '300px',
      background: 'white',
      border: '1px solid #ccc',
    //   border: '5px solid rgb(255, 0, 0)',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
    },
    popupList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    popupListItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 0',
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
      marginTop: '10px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      width: '100%',
    },
  };

export default BottomRightPopup;

