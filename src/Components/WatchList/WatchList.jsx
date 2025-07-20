
import React from 'react';
import { Link } from 'react-router-dom';
import './WatchList.css';
import { useWatchlist } from '../WatchlistContext/WatchlistContext';

const WatchList = () => {
  const { watchlist } = useWatchlist(); // Get from context

  return (
    <div className="watchlist-page">
      <h1>Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="watchlist-card">
              <img src={movie.poster} alt={movie.title} />
              <h3>{movie.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export {WatchList}
