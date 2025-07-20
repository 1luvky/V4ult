// src/contexts/AuthContext.js
/* global __initial_auth_token */ // Declare __initial_auth_token as a global variable for ESLint

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Your web app's Firebase configuration (copied directly from your provided snippet)
const firebaseConfig = {
  apiKey: "AIzaSyCkc3fMLBHNm1f7hVMY50XO-S8jzGaMHzk",
  authDomain: "devcomm-10e82.firebaseapp.com",
  projectId: "devcomm-10e82",
  storageBucket: "devcomm-10e82.firebasestorage.app",
  messagingSenderId: "487289032607",
  appId: "1:487289032607:web:0172595f1f36548c9737aa",
  measurementId: "G-H0L3PS753P"
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authInstance, setAuthInstance] = useState(null);

  useEffect(() => {
    let app;
    let auth;

    try {
      // Initialize Firebase with your provided config
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      setAuthInstance(auth); // Store the auth instance
      console.log("Firebase initialized with provided config.");
    } catch (e) {
      console.error("Error initializing Firebase:", e);
      setLoadingAuth(false);
      return;
    }

    // Attempt to sign in with custom token or anonymously
    // This part is specific to the Canvas environment's __initial_auth_token
    const authenticate = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
          console.log("AuthProvider: Signed in with custom token.");
        } catch (tokenError) {
          console.error("AuthProvider: Error signing in with custom token:", tokenError);
          try {
            await signInAnonymously(auth);
            console.log("AuthProvider: Signed in anonymously after token error.");
          } catch (anonError) {
            console.error("AuthProvider: Error signing in anonymously:", anonError);
          }
        }
      } else {
        try {
          await signInAnonymously(auth);
          console.log("AuthProvider: Signed in anonymously.");
        } catch (anonError) {
          console.error("AuthProvider: Error signing in anonymously:", anonError);
        }
      }
    };

    authenticate();

    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
      console.log("AuthProvider: Auth state changed. User:", user ? user.uid : 'None');
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Run once on mount

  const value = {
    currentUser,
    auth: authInstance, // Provide the auth instance
    loadingAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children} {/* Only render children once auth is loaded */}
    </AuthContext.Provider>
  );
};
