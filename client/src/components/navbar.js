import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';
import '../css/navbar.css'; // Ensure this file exists for styling

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const images = importAll(require.context('../profile', false, /\.(png|jpe?g|svg)$/));

function Navbar() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setUser(userData); // Set user data if available
        if (userData && userData.email) {
          fetchUserProfile(userData.email); // Fetch user profile if email exists
        } else {
          // If no user data, show default image by setting profile to null
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setUserProfile(null); // On error, set profile to null to show default image
      }
    };

    fetchUserData();
  }, []);

  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(`http://localhost:9001/profiles?email=${email}`);
      if (response.data.success && response.data.userProfile) {
        setUserProfile(response.data.userProfile); // Update state with user profile data
      } else {
        // If no profile exists for the user, set profile to null to show default image
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response ? error.response.data : error.message);
      setUserProfile(null); // On error, set profile to null
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {user && (
          <div className="user-info">
            <div className="user-profile">
              <Link to="/profile"> {/* Wrap the profile image in a Link component */}
                <img
                  src={userProfile && userProfile.image ? images[userProfile.image] : images['default.png']} // Show default image if no userProfile or image
                  alt="Profile"
                  className="profile-image"
                />
              </Link>
              <br/>
            </div>
          </div>
        )}
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="#">Dashboard</Link>
              <Link to="#">About Us</Link>
              <Link to="#">Search</Link>
              <Link to="/">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
