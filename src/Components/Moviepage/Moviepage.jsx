// src/components/MoviesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Moviepage.css';
import { ClipLoader } from 'react-spinners';

const Moviepage = () => {  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FALLBACK_IMAGE_URL = "https://placehold.co/226x300/333333/FFFFFF?text=No+Image";

  useEffect(() => {
    const cachedMovies = sessionStorage.getItem("allMovies");

        if (cachedMovies) {
            setMovies(JSON.parse(cachedMovies));
            setLoading(false);
            return;
        }
    axios.get("http://localhost:5000/api/movies-list")
      .then((res) => {
        const fetchedMovies = res.data.data.movies.map(movie => ({
          id: movie.id,
          title: movie.title_english || movie.title,
          poster: movie.large_cover_image || movie.medium_cover_image,
          rating: movie.rating || 'N/A',
        })).filter(movie => movie.poster);

        setMovies(fetchedMovies);
        sessionStorage.setItem("allMovies", JSON.stringify(fetchedMovies));
        setLoading(false);
      })
      .catch((err) => {
        console.error("MoviesPage: Error fetching movies list", err);
        setError("Failed to load movies. Please try again later.");
        setLoading(false);
      });
  }, []);

 if (loading) {
  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">All Movies</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    </div>
  );
}


  if (error) {
    return (
      <div className="movies-page-container">
        <h1 className="movies-page-title">All Movies</h1>
        <p className="error-message" style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="movies-page-container">
      <h1 className="movies-page-title">All Movies</h1>
      {movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <Link
              to={`/movie/${encodeURIComponent(movie.id)}`}
              key={movie.id}
              className="movie-card"
            >
              <img
                src={movie.poster || FALLBACK_IMAGE_URL}
                alt={movie.title}
                className="movie-poster"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE_URL;
                }}
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-rating">⭐ {movie.rating}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default Moviepage;
