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

const images_root = "../../../../public/assets/images/"

const categoryImages: { [key: string]: string } = {
  "Administrative Area": "administrative-area.jpg",
  "Airport": "airport.jpg",
  "Book": "book.jpg",
  "City": "city.jpg",
  "College or University": "college-or-university.avif",
  "Country": "country.jpg",
  "Creative Work": "creative-work.avif",
  "Data Set": "data-set.png",
  "Educational Organization": "educational-organization.jpg",
  "Event": "event.avif",
  "Geo Coordinates": "geo-coordinates.jpg",
  "Government Organization": "government-organization.jpg",
  "Hospital": "hospital.jpg",
  "Hotel": "hotel.jpg",
  "Job Posting": "job-posting.jpg",
  "Lake Body of Water": "lake-body-of-water.jpg",
  "Landmarks or Historical Buildings": "landmarks-or-historical-buildings.jpg",
  "Language": "language.jpg",
  "Library": "library.jpg",
  "Local Business": "local-business.jpg",
  "Mountain": "mountain.jpg",
  "Movie": "movie.jpg",
  "Museum": "museum.jpg",
  "Music Album": "music-album.jpg",
  "Music Recording": "music-recording.jpg",
  "Painting": "painting.jpg",
  "Park": "park.jpg",
  "Place": "place.jpg",
  "Product": "product.jpg",
  "Question": "question.jpg",
  "Radio Station": "radio-station.jpg",
  "Recipe": "recipe.jpg",
  "Restaurant": "restaurant.jpg",
  "River Body of Water": "river-body-of-water.jpg",
  "School": "school.jpg",
  "Shopping Center": "shopping-center.jpg",
  "Ski Resort": "ski-resort.jpg",
  "Sports Event": "sports-event.jpg",
  "Sports Team": "sports-team.jpg",
  "Stadium or Arena": "stadium-or-arena.jpg",
  "Television Station": "television-station.jpg",
  "TV Episode": "tv-episode.jpg"
};

export const Route = createFileRoute("/_layout/classify/classify")({
  component: Classify,
});

function Classify() {
  return (
    <div className="gridContainer">
      {categories.map((category) => {
        const backgroundImage = (images_root + categoryImages[category]) || (images_root + "default.png"); // Fallback to default image
        return (
          <Link
            key={category}
            to={`/classify/categoryDetails?category=${category}&backgroundImage=${categoryImages[category]}`}
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

