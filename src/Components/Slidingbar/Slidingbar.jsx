import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import Slider from 'react-slick';
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import "./Slidingbar.css";
import { ClipLoader } from 'react-spinners'; // import a spinner of your choice


// Assuming you have a default image in your public folder or a direct URL
// If you don't have one, you can use a placeholder service like placehold.co
const FALLBACK_IMAGE_URL = "https://placehold.co/226x300/cccccc/000000?text=No+Image";


const Slidingbar = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to keep track of movie IDs whose images have failed to load at runtime
  const [failedImageIds, setFailedImageIds] = useState(new Set()); // New state variable

  useEffect(() => {
    const cachedMovies = sessionStorage.getItem("cachedMovies");

    if (cachedMovies) {
      setMovies(JSON.parse(cachedMovies));
      setLoading(false);
      return; // Don't call the API again
    }
    axios.get("https://devcomm-backend-3obc.onrender.com/api/movies-list")
      .then((res) => {
        const fetchedMovies = res.data.data.movies.map(movie => ({
          id: movie.id,
          title: movie.title_english || movie.title,
          poster: movie.large_cover_image || movie.medium_cover_image,
          rating: movie.rating || 'N/A',
        }));

        const moviesWithPosters = fetchedMovies.filter(movie => movie.poster);

        setMovies(moviesWithPosters.slice(0, 20)); // Take only the first 20 movies with posters
        sessionStorage.setItem("cachedMovies", JSON.stringify(fetchedMovies)); // ✅ match this
        setLoading(false);
      })
      .catch((err) => {
        console.error("Slidingbar: Error fetching movies list", err);
        setError("Failed to load movies. Please check the server.");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on component mount


  // Function to handle image loading errors (triggered by onError event on <img>)
  const handleImageError = (movieId, e) => {
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
    e.target.src = FALLBACK_IMAGE_URL; // Apply fallback image *briefly* before card removal

    // Add the movie ID to our set of failed images.
    // This will trigger a re-render and cause the movie card to be filtered out.
    setFailedImageIds(prevIds => {
      const newSet = new Set(prevIds);
      newSet.add(movieId);
      return newSet;
    });
    
    console.error(`Image for movie ID: ${movieId} failed to load at runtime. Card will be removed.`);
  };

  // Use useMemo to filter the 'movies' array before rendering the Slider.
  // This memoized value only re-calculates when 'movies' data or 'failedImageIds' change.
  const moviesToRender = useMemo(() => {
    return movies.filter(movie => {
      // This second layer of filtering catches movies whose images failed to load at runtime.
      if (failedImageIds.has(movie.id)) {
        // console.warn(`Movie "${movie.title}" (ID: ${movie.id}) excluded due to runtime image load failure.`);
        return false; // Exclude this movie
      }
      return true; // Include this movie if its image hasn't failed
    });
  }, [movies, failedImageIds]); // Depend on 'movies' and 'failedImageIds'


  // Slider settings
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

      {/* Render the slider only if there are movies to show after all filtering */}
      {Array.isArray(moviesToRender) && moviesToRender.length > 0 ? (
        <Slider {...settings}>
          {moviesToRender.map((movie) => {
            // No need for `if (!movie.poster)` here anymore as it's handled in `useEffect` and `moviesToRender` filter

            return (
              <Link
                to={`/movie/${encodeURIComponent(movie.id)}`}
                key={movie.id}
                className="movie-card-link"
              >
                <div className="movie-card">
                  <img
                    src={movie.poster}
                    alt={movie.title || 'Movie Poster'}
                    className="movie-poster"
                    // Pass movie.id to the error handler to track failed images
                    onError={(e) => handleImageError(movie.id, e)}
                  />
                  <h3 className="movie-title">{movie.title}</h3>
                  {movie.rating && (
                    <p className="movie-rating">⭐ {movie.rating}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </Slider>
      ) : (
        // Message if no movies are found or all were filtered out due to missing/failed images
        <p>No new releases found with available images.</p>
      )}
    </div>
  );
};

export default Slidingbar;  