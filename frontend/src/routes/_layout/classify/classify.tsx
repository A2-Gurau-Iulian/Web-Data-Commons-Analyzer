import { createFileRoute, Link } from "@tanstack/react-router";
import './Classify.css';

// Categories array
const categories = [
  "Administrative Area", "Airport", "Book", "City", "College or University", "Country", "Creative Work", "Data Set", 
  "Educational Organization", "Event", "Geo Coordinates", "Government Organization", "Hospital", "Hotel", "Job Posting", "Lake Body of Water", 
  "Landmarks or Historical Buildings", "Language", "Library", "Local Business", "Mountain", "Movie", "Museum", 
  "Music Album", "Music Recording", "Painting", "Park", "Place", "Product", "Question", 
  "Radio Station", "Recipe", "Restaurant", "River Body of Water", "School", "Shopping Center", "Ski Resort", 
  "Sports Event", "Sports Team", "Stadium or Arena", "Television Station", "TV Episode"
];

const categoryImages: { [key: string]: string } = {
  "Administrative Area": "../../../../public/assets/images/administrative-area.jpg",
  "Airport": "../../../../public/assets/images/airport.jpg",
  "Book": "../../../../public/assets/images/book.jpg",
  "City": "../../../../public/assets/images/city.jpg",
  "College or University": "../../../../public/assets/images/college-or-university.avif",
  "Country": "../../../../public/assets/images/country.jpg",
  "Creative Work": "../../../../public/assets/images/creative-work.avif",
  "Data Set": "../../../../public/assets/images/data-set.png",
  "Educational Organization": "../../../../public/assets/images/educational-organization.jpg",
  "Event": "../../../../public/assets/images/event.avif",
  "Geo Coordinates": "../../../../public/assets/images/geo-coordinates.jpg",
  "Government Organization": "../../../../public/assets/images/government-organization.jpg",
  "Hospital": "../../../../public/assets/images/hospital.jpg",
  "Hotel": "../../../../public/assets/images/hotel.jpg",
  "Job Posting": "../../../../public/assets/images/job-posting.jpg",
  "Lake Body of Water": "../../../../public/assets/images/lake-body-of-water.jpg",
  "Landmarks or Historical Buildings": "../../../../public/assets/images/landmarks-or-historical-buildings.jpg",
  "Language": "../../../../public/assets/images/language.jpg",
  "Library": "../../../../public/assets/images/library.jpg",
  "Local Business": "../../../../public/assets/images/local-business.jpg",
  "Mountain": "../../../../public/assets/images/mountain.jpg",
  "Movie": "../../../../public/assets/images/movie.jpg",
  "Museum": "../../../../public/assets/images/museum.jpg",
  "Music Album": "../../../../public/assets/images/music-album.jpg",
  "Music Recording": "../../../../public/assets/images/music-recording.jpg",
  "Painting": "../../../../public/assets/images/painting.jpg",
  "Park": "../../../../public/assets/images/park.jpg",
  "Place": "../../../../public/assets/images/place.jpg",
  "Product": "../../../../public/assets/images/product.jpg",
  "Question": "../../../../public/assets/images/question.jpg",
  "Radio Station": "../../../../public/assets/images/radio-station.jpg",
  "Recipe": "../../../../public/assets/images/recipe.jpg",
  "Restaurant": "../../../../public/assets/images/restaurant.jpg",
  "River Body of Water": "../../../../public/assets/images/river-body-of-water.jpg",
  "School": "../../../../public/assets/images/school.jpg",
  "Shopping Center": "../../../../public/assets/images/shopping-center.jpg",
  "Ski Resort": "../../../../public/assets/images/ski-resort.jpg",
  "Sports Event": "../../../../public/assets/images/sports-event.jpg",
  "Sports Team": "../../../../public/assets/images/sports-team.jpg",
  "Stadium or Arena": "../../../../public/assets/images/stadium-or-arena.jpg",
  "Television Station": "../../../../public/assets/images/television-station.jpg",
  "TV Episode": "../../../../public/assets/images/tv-episode.jpg"
};

export const Route = createFileRoute("/_layout/classify/classify")({
  component: Classify,
});

function Classify() {
  return (
    <div className="gridContainer">
      {categories.map((category) => {
        const backgroundImage = categoryImages[category] || "../../../../public/assets/images/default.png"; // Fallback to default image
        return (
          <Link
            key={category}
            to={`/classify/categoryDetails?category=${category}`}
            params={{ category }}
            className="box"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}

