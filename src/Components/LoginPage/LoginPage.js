// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth methods
import { useAuth } from '../Contexts/AuthContext'; // Import useAuth hook

import './LoginPage.css'; // Import the CSS for this page

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true for login, false for sign-up
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { auth, currentUser, loadingAuth } = useAuth(); // Get auth instance and user from context

  // Optional: Redirect if user is already logged in
  // useEffect(() => {
  //   if (currentUser && !loadingAuth) {
  //     navigate('/');
  //   }
  // }, [currentUser, loadingAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!auth) {
      setError("Firebase Auth not initialized. Please try again.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login existing user with Firebase
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully!');
      } else {
        // Create new user with Firebase
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up successfully!');
      }
      navigate('/'); // Redirect to home page on success
    } catch (err) {
      console.error('Authentication error:', err.message);
      // Display user-friendly error messages based on Firebase error codes
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/email-already-in-use':
          setError('This email is already in use.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError('Authentication failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="login-page-container">
        <div className="login-form-card">
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <h2 className="login-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="toggle-mode-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-mode-link">
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
