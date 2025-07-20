// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Corrected import for Link
import { CircleUser, Search } from 'lucide-react'; // Imported Search icon
import { useAuth } from '../../Components/Contexts/AuthContext'; // Corrected path to AuthContext
import { signOut } from 'firebase/auth'; // Correct import
import { Bookmark } from 'lucide-react';
import { useWatchlist } from '../WatchlistContext/WatchlistContext';

import './Navbar.css'; // Corrected path to Navbar.css

const Navbar = () => {
    const { currentUser, auth } = useAuth(); // Get currentUser and auth instance from context
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (auth) {
            try {
                await signOut(auth);
                console.log("User logged out successfully!");
                navigate('/login'); // Redirect to login page after logout
            } catch (error) {
                console.error("Error logging out:", error.message);
            }
        }
    };

    return (
        <nav className="Navbar"> {/* Main Navbar container */}
            <Link to="/" className='Sitenamelink'>
            <div className="Sitename"> {/* Site name/logo */}
                v4ult
            </div></Link>
            <div className="right"> {/* Container for right-aligned elements */}
                {/* Navigation Links */}
                <Link to="/" className="Button">Home</Link> {/* Using Link for internal navigation */}
                <Link to="/movies" className="Button">Movies</Link> {/* Assuming you'll have a /movies route */}
                
                
               

                {/* Search bar with icon */}
                <div className="search-container"> {/* Wrapper for search bar and icon */}
                    <input className="search-bar" type="text" placeholder='Search' />
                    
                </div>
                
                 {/* Conditional rendering based on authentication status */}
                {currentUser ? ( // If a user is logged in
                    <>
                        {/* Profile icon link */}
                        <Link to="/profile" className="Profile" aria-label="Go to Profile">
                            <CircleUser size={28} strokeWidth={2} /> {/* Adjust size and strokeWidth as needed */}
                        </Link>
                        
                        <button onClick={handleLogout} className="logout">Logout</button> {/* Using "Button" class */}
                    </>
                ) : ( // If no user is logged in
                    <Link to="/login" className="Button">Sign In</Link> 
                )}

                <Link to="/watchlist" className="relative">
                    <Bookmark/>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                        {useWatchlist().watchlist.length}
                    </span>
                    </Link>
                
            </div>
        </nav>
    );
};

export default Navbar;
