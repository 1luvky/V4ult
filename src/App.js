// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './Components/Contexts/AuthContext'; // Import AuthProvider
import Navbar from './Components/Navbar/Navbar'; // Adjust path if necessary
import Background from './Components/Background/Background'; // Adjust path if necessary
import Slidingbar from './Components/Slidingbar/Slidingbar'; // Adjust path if necessary
import Footer from "./Components/Footer/Footer"; // Adjust path if necessary
import LoginPage from './Components/LoginPage/LoginPage';
import ProfilePage from './Components/Profilepage/Profilepage'; // Import ProfilePage
import Moviepage from './Components/Moviepage/Moviepage';
import MovieDetail from './Components/MovieDetailPage/MovieDetailPage';
import { WatchlistProvider } from './Components/WatchlistContext/WatchlistContext'; 
import {WatchList} from './Components/WatchList/WatchList'
 


const HomePage = () => {
  return (
    <>

      <Background />
      <Slidingbar />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider> 
        <WatchlistProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} /> 
              <Route path="/movies" element={<Moviepage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/watchlist" element={<WatchList />} />
            </Routes>
            <Footer />
          </div>
  </WatchlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
