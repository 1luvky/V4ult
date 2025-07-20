// src/components/ProfilePage.js
import React from 'react';
import { useAuth } from '../Contexts/AuthContext'; 

const ProfilePage = () => {
  const { currentUser, loadingAuth } = useAuth();

  // Placeholder for user details that would typically come from a database
  const userDetails = {
    displayName: currentUser?.displayName || 'Not Set',
    dob: 'January 1, 1990', // Placeholder
    gender: 'Prefer not to say', // Placeholder
    location: 'Earth', // Placeholder
    lastLogin: currentUser?.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'N/A',
    creationTime: currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleString() : 'N/A',
    profilePicture: currentUser?.photoURL || 'https://placehold.co/100x100/333333/FFFFFF?text=P', // Placeholder or actual photoURL
  };

  if (loadingAuth) {
    return (
      <div style={{ padding: '50px', maxWidth: '800px', margin: '50px auto', backgroundColor: '#141414', borderRadius: '8px', color: '#e5e5e5', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '50px auto', backgroundColor: '#141414', borderRadius: '8px', color: '#e5e5e5' }}>
      <h1 style={{ color: '#e5e5e5', marginBottom: '20px', textAlign: 'center' }}>Your Profile</h1>
      {currentUser ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <img
            src={userDetails.profilePicture}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e50914' }}
          />
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>{userDetails.displayName}</h2>
          <div style={{ width: '100%', maxWidth: '400px', textAlign: 'left' }}>
            <p style={{ marginBottom: '10px' }}><strong>Email:</strong> {currentUser.email}</p>
            <p style={{ marginBottom: '10px' }}><strong>User ID:</strong> {currentUser.uid}</p>
            <p style={{ marginBottom: '10px' }}><strong>Date of Birth:</strong> {userDetails.dob}</p>
            <p style={{ marginBottom: '10px' }}><strong>Gender:</strong> {userDetails.gender}</p>
            <p style={{ marginBottom: '10px' }}><strong>Location:</strong> {userDetails.location}</p>
            <p style={{ marginBottom: '10px' }}><strong>Last Login:</strong> {userDetails.lastLogin}</p>
            <p style={{ marginBottom: '10px' }}><strong>Member Since:</strong> {userDetails.creationTime}</p>
          </div>
          {/* Add more profile details or actions here */}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
