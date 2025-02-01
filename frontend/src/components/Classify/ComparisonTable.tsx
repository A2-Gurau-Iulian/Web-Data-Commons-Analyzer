import React from 'react';

interface ComparisonTableProps {
  compareList: Array<{ attribute: string; value: any }[]>;
  tableCategory;
  onClose: () => void; // Function to close the popup
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ compareList, tableCategory, onClose }) => {
  if (compareList.length === 0) {
    onClose();
  }

const isValidUrl = (value: string) => {
try {
    new URL(value); // Throws if invalid
    return true;
} catch {
    return false;
}
};

// Helper function to render JSON recursively
const renderValue = (value: any) => {
// Check if the value is a JSON string
if (typeof value === 'string') {
try {
    const parsed = JSON.parse(value);
    return renderValue(parsed); // Recurse for nested JSON objects
} catch (error) {
    // If not JSON, return the string as-is
    // console.error("Error parsing JSON:", error);
    if(isValidUrl(value)){
        return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
    }
    return <span>{value}</span>;
}
}

// Handle arrays
if (Array.isArray(value)) {
return (
    <ul>
    {value.map((item, index) => (
        <li key={index}>{renderValue(item)}</li>
    ))}
    </ul>
);
}

// Handle objects
if (typeof value === 'object' && value !== null) {
return (
    <div style={styles.jsonObject}>
    {Object.entries(value).map(([key, val], index) => (
        <div key={index} style={styles.jsonEntry}>
        <strong>{key}:</strong> {renderValue(val)}
        </div>
    ))}
    </div>
);
}

// For primitive values, render as-is
if(isValidUrl(value)){
    return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
}
return <span>{value}</span>;
};

  // Extract unique attributes from all objects in the compareList
  const attributes = Array.from(
    new Set(compareList.flatMap((item) => item.map((info) => info.attribute)))
  );

  return (
    <div style={styles.tableContainer}>
      <button onClick={onClose} style={styles.closeButton}>
        Close
      </button>
      <h2>{tableCategory} Comparison Table</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.headerCell}>Attribute</th>
            {compareList.map((_, index) => (
              <th key={index} style={styles.headerCell}>{`Item ${index + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute) => (
            <tr key={attribute}>
              <td style={styles.attributeCell}>{attribute}</td>
              {compareList.map((item, index) => {
                const info = item.find((info) => info.attribute === attribute);
                return (
                    <td key={index} style={styles.valueCell}>
                    {info
                      ? renderValue(info.value)
                      : 'N/A'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    position: 'fixed',
    top: '100px',
    left: '300px',
    background: 'white',
    border: '1px solid #ccc',
    // border: '5px solid rgb(255, 0, 0)',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    overflowY: 'auto',
    height: '600px',
    zIndex: 999
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed', // Equal column width
    // overflowX: 'auto', // Scrollable if needed
    border: '5px solid #ccc',
  },
  headerCell: {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'left',
    verticalAlign: 'top',
  },
  attributeCell: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
    verticalAlign: 'top',
  },
  valueCell: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    verticalAlign: 'top',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  jsonObject: {
    // border: '5px solid rgb(142, 250, 0)',
    marginLeft: '16px',
    backgroundColor: '#f0f0f0',
    padding: '8px',
    borderRadius: '4px',
    },
  jsonEntry: {
    // border: '5px solid rgb(55, 0, 255)',
    marginBottom: '4px',
    },
};

export default ComparisonTable;
