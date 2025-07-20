// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import the footer specific CSS

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/contact" className="footer-link">Contact Us</Link>
          {/* Add more links here if needed */}
        </div>
        <p className="footer-text">&copy; {new Date().getFullYear()} Your Movie App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
