// src/WatchlistContext/WatchlistContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../Firebase'; // ✅ Make sure this exports initialized Firestore
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { useAuth } from '../Contexts/AuthContext';

const WatchlistContext = createContext();
export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  // ✅ Load watchlist from Firestore when user logs in
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'watchlists', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setWatchlist(data.movies || []);
          } else {
            await setDoc(userDocRef, { movies: [] });
            setWatchlist([]);
          }
          
        } 
        
        catch (err) {
          console.error("Failed to fetch watchlist:", err);
        }
      }
      else {
      setWatchlist([]); // 👈 Clear watchlist on logout
    }
    };

    fetchWatchlist();
  }, [currentUser]);

  // ✅ Save updated list directly to Firestore
  const saveWatchlist = async (updatedList) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'watchlists', currentUser.uid);
    await updateDoc(userDocRef, { movies: updatedList });
    setWatchlist(updatedList);
  };

  const addToWatchlist = async (movie) => {
    if (!currentUser) return;
    const alreadyExists = watchlist.some((m) => m.id === movie.id);
    if (alreadyExists) return;

    const updatedList = [...watchlist, movie];
    await saveWatchlist(updatedList);
  };

  const removeFromWatchlist = async (movieId) => {
    if (!currentUser) return;
    const updatedList = watchlist.filter((movie) => movie.id !== movieId);
    await saveWatchlist(updatedList);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
