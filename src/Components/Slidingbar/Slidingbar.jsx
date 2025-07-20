import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import "./Slidingbar.css"
import { ClipLoader } from 'react-spinners'; // import a spinner of your choice


// Assuming you have a default image in your public folder or a direct URL
// If you don't have one, you can use a placeholder service like placehold.co
const FALLBACK_IMAGE_URL = "https://placehold.co/226x300/cccccc/000000?text=No+Image";

const Slidingbar = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  axios.get("http://localhost:5000/api/movies-list")
    .then((res) => {
      const fetchedMovies = res.data.data.movies.map(movie => ({
        id: movie.id,
        title: movie.title_english || movie.title,
        poster: movie.large_cover_image || movie.medium_cover_image,
        rating: movie.rating || 'N/A',
      })).filter(movie => movie.poster);

      setMovies(fetchedMovies.slice(0, 20));
      setLoading(false);
    })
    .catch((err) => {
      console.error("Slidingbar: Error fetching movies list", err);
      setError("Failed to load movies. Please check the server.");
      setLoading(false);
    });
}, []);


  // Log the current state of movies right before rendering
  console.log("Current movies state for rendering:", movies);

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  if (loading) {
  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">New Releases</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="carousel-wrapper">
        <h2 className="carousel-title">New Releases</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">New Releases</h2>
      {Array.isArray(movies) && movies.length > 0 ? (
        <Slider {...settings}>
          {movies.map((movie) => {
            // Log each movie being mapped
            console.log("Mapping movie:", movie.title, movie.id);
            return (
              <Link
                to={`/movie/${encodeURIComponent(movie.id)}`}
                key={movie.id}
                className="movie-card-link"
              >
                <div className="movie-card">
                  <img
                    src={movie.poster || FALLBACK_IMAGE_URL} // Use fallback if poster is null
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => {
                      // If the image fails to load, set its source to the fallback
                      e.target.onerror = null; // Prevent infinite loop if fallback also fails
                      e.target.src = FALLBACK_IMAGE_URL;
                      console.error(`Failed to load image for: ${movie.title} from ${movie.poster}`);
                    }}
                  />
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-rating">⭐ {movie.rating}</p>
                </div>
              </Link>
            );
          })}
        </Slider>
      ) : (
        <p>No new releases found.</p> // Message if movies array is empty
      )}
    </div>
  );
};

export default Slidingbar;
