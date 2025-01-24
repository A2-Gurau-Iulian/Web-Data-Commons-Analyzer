import React, { useEffect, useState } from 'react';

interface RightContainerProps {
  category: string;
  selectedItemId: string | null; // Nullable, as no item may be selected initially
  backgroundImage: string;
}
    
const RightContainer: React.FC<RightContainerProps> = ({ category, selectedItemId, backgroundImage }) => {
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const images_root = "../../public/assets/images/"
  const image_background = images_root + backgroundImage;
  
  // Fetch additional info whenever `selectedItemId` changes
  useEffect(() => {
    if (selectedItemId != null) {
        fetchAdditionalInfo(selectedItemId);
        setIsCollapsed(true);
    } else {
        setAdditionalInfo([]); // Clear info when no item is selected
    }
  }, [selectedItemId]);

    const fetchAdditionalInfo = async (id: string) => {
    setLoading(true);
    try {
        const response = await fetch(`http://127.0.0.1:8000/item_by_id/sparql?category=${category}&id=${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAdditionalInfo(data.results || []); // Default to an empty array
    } catch (error) {
        console.error('Error fetching additional info:', error);
        setAdditionalInfo([]); // Clear additional info on error
    }
    setLoading(false);
    };

    const isValidUrl = (value: string) => {
        try {
            new URL(value); // Throws if invalid
            return true;
        } catch {
            return false;
        }
    };

    // Function to toggle collapse state
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

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

    return (
        <div style={styles.rightContainer}>
          {/* Loading indicator */}
          {loading ? (
            <p>Loading additional info...</p>
          ) : additionalInfo.length > 0 ? (
            <>
              {/* Information Section */}
              <h2>Information</h2>
              {additionalInfo
                .filter((info) => info.attribute !== 'other_info') // Exclude "other_info" here
                .map((info, index) => (
                  <div key={index} style={styles.infoItem}>
                    <strong>{info.attribute}:</strong> {renderValue(info.value)}
                  </div>
                ))}
    
                  {additionalInfo.some(
                (info) =>
                  info.attribute === 'other_info' &&
                  info.value &&
                  Object.keys(info.value).length > 0 // Ensure it's not empty
              ) && (
                <>
                  <h2>Other Information</h2>
                  <button onClick={toggleCollapse} style={styles.collapseButton}>
                    {isCollapsed ? 'Expand' : 'Collapse'}
                  </button>
                  {!isCollapsed && (
                    <div style={styles.collapsedContent}>
                      {additionalInfo
                        .filter((info) => info.attribute === 'other_info')
                        .map((info, index) => (
                          <div key={index} style={styles.infoItem}>
                            {renderValue(info.value)}
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p>No additional information available.</p>
          )}
        </div>
      );
};

const styles = {
    rightContainer: {
        flex: 0.7, // Adjust width of right container
        // height: '500px',
        padding: '20px',
        paddingRight: '50px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        // maxHeight: '500px', // Adjust height as needed
        overflowY: 'auto',  // Enables vertical scrolling when content overflows
        },
    infoItem: {
        // border: '5px solid rgb(255, 0, 0)',
        marginBottom: '12px',
        // width: '95%'
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
    collapseButton: {
        margin: '1rem 0',
        padding: '0.5rem 1rem',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        },
    collapsedContent: {
        padding: '1rem',
        background: '#eef',
        borderRadius: '4px',
        marginTop: '0.5rem',
        },    
};

export default RightContainer;
