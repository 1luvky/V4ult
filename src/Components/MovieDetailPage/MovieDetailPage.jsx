// src/pages/MovieDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetailPage.css';
import { useWatchlist } from '../WatchlistContext/WatchlistContext';
import { ClipLoader } from 'react-spinners';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { watchlist, addToWatchlist } = useWatchlist();

  const added = watchlist.some(item => item.id === id);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movie/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleAddToWatchlist = () => {
    if (!added && movie) {
      const simplifiedMovie = {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating
      };
      addToWatchlist(simplifiedMovie);
    }
  };

  if (loading || !movie) return  <div className="carousel-wrapper">
      <h2 className="carousel-title">Movie Loading  </h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    </div>;

  return (
    <div className="movie-detail-container">
      <img src={movie.poster} alt={movie.title} className="movie-detail-poster" />
      <div className="movie-detail-info">
        <h1>{movie.title}</h1>
        <p><strong>Year:</strong> {movie.releaseYear || "N/A"}</p>
        <p><strong>Rating:</strong> {movie.rating || "N/A"}</p>
        <p><strong>Genres:</strong> {movie.genres?.join(', ') || "N/A"}</p>
        <p><strong>Summary:</strong> {movie.plot || "No description available."}</p>
        <button
          className={`watchlist-btn ${added ? 'added' : ''}`}
          onClick={handleAddToWatchlist}
          disabled={added}
        >
          {added ? '✓ Added to Watchlist' : 'Add to Watchlist'}
        </button>
      </div>
    </div>
  );
};

export default MovieDetailPage;
