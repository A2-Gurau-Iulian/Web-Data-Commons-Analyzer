import { createFileRoute, Link } from "@tanstack/react-router";

// Categories array
const categories = [
  "Movie", "Airport", "Product", "Event", "Book", "Car", "Building", "Country", 
  "City", "Animal", "Plant", "Song", "Sport", "Game", "Language", "Food", 
  "Drink", "Planet", "Star", "Galaxy", "Element", "Material", "Tool", 
  "Technology", "Job", "Hobby", "Skill", "School", "University", "Team", 
  "Festival", "Holiday", "Myth", "Legend", "Character", "Story", "Series", 
  "Season", "Episode", "Instrument", "Medicine", "Disease"
];

export const Route = createFileRoute("/_layout/classify/classify")({
  component: Classify,
});

function Classify() {
  return (
    <div style={styles.gridContainer}>
      {categories.map((category) => (
        <Link
          key={category}
          to={`/classify/categoryDetails?category=${category}`}
          params={{ category }}
          style={styles.box}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)", // Always 6 columns
    gridTemplateRows: "repeat(7, 1fr)",   // Always 7 rows
    gap: "8px", // Gap between boxes
    height: "100vh", // Full viewport height for grid
    width: "100vw", // Full viewport width for grid
    padding: "16px", // Padding around the grid
    boxSizing: "border-box", // Include padding in the element's total width and height
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#333",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
    transition: "transform 0.2s, background 0.2s",
  },
  "@media (max-width: 768px)": {
    gridContainer: {
      gridTemplateColumns: "repeat(6, 1fr)", // Keep 6 columns
      gridTemplateRows: "repeat(7, 1fr)",   // Keep 7 rows
      gap: "4px", // Reduce gap for smaller screens
    },
    box: {
      fontSize: "12px", // Adjust font size for smaller screens
    },
  },
  "@media (max-width: 480px)": {
    gridContainer: {
      gridTemplateColumns: "repeat(6, 1fr)", // Keep 6 columns
      gridTemplateRows: "repeat(7, 1fr)",   // Keep 7 rows
      gap: "2px", // Further reduce gap
    },
    box: {
      fontSize: "10px", // Smaller font size for very small screens
    },
  },
};
