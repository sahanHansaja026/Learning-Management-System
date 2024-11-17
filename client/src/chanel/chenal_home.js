import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import authService from "../services/authService";
import PrimaryAdmin from "./PrimaryAdmin";
import SecondaryAdmin from "./SecondaryAdmin";
import "../css/chenal_details.css";

const ChenalDetails = () => {
  const [post, setPost] = useState(null); // Set initial state to null
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("primaryAdmin");
  const [userProfile, setUserProfile] = useState(null); // State for user profile
  const { id } = useParams();

  // Fetch channel details
  useEffect(() => {
    axios
      .get(`http://localhost:9001/chnel/${id}`)
      .then((res) => {
        if (res.data.success) {
          setPost(res.data.post); // Set post data when available
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  }, [id]);

  // Fetch user data and admin profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch current user's data
        const userData = await authService.getUserData();
        setUsername(userData.username);
        setEmail(userData.email);

        // Fetch profile using Admin Email from post if available
        if (post?.email) {
          const profileResponse = await axios.get(
            `http://localhost:9001/userprofile/summary/${post.email}`
          );
          if (profileResponse.data.success) {
            setUserProfile(profileResponse.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data or profile", error);
      }
    };

    if (post?.email) {
      fetchUserData();
    }
  }, [post]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Check if user email matches admin email to conditionally render the Primary Admin tab
  const showPrimaryAdminTab = post?.email === email;
  const showPrimaryConten = post?.email === email;
  const elseshowtab = post?.email !== email;

  if (!post) {
    return <div>Loading...</div>; // Show loading message while post is being fetched
  }

  return (
    <div className="channel-page">
      <div
        className="banner"
        style={{
          backgroundImage: `url(http://localhost:9001/ChenalsFile/${post.image})`,
        }}
      >
        <div className="banner-overlay">
          <h1 className="channel-title">{post.title}</h1>
        </div>

        <div className="chanelprofile">
          <img
            src={
              userProfile && userProfile.image
                ? `http://localhost:9001/Profileimge/${userProfile.image}` // Profile image from backend
                : `http://localhost:9001/Profileimge/default.png` // Default image
            }
            alt="Profile"
            className="chaneldpimage"
          />
        </div>
      </div>

      <div className="channel-details">
        <h2>Welcome, {username}!</h2>

        <div className="channel-summary">
          <h3>About This Channel</h3>
          <p className={isExpanded ? "expanded" : "collapsed"}>
            {post?.summery}
          </p>
          <button className="toggle-button" onClick={toggleExpand}>
            {isExpanded ? "See Less" : "See More"}
          </button>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="tab">
        {showPrimaryAdminTab && (
          <button
            className={`tablinks ${
              activeTab === "primaryAdmin" ? "active" : ""
            }`}
            onClick={() => handleTabClick("primaryAdmin")}
          >
            Admin
          </button>
        )}
        <button
          className={`tablinks ${
            activeTab === "secondaryAdmin" ? "active" : ""
          }`}
          onClick={() => handleTabClick("secondaryAdmin")}
        >
          Third Party
        </button>
      </div>

      {/* Tab Content */}
      {showPrimaryConten && activeTab === "primaryAdmin" && <PrimaryAdmin />}
      {elseshowtab && activeTab === "secondaryAdmin" && <SecondaryAdmin />}
    </div>
  );
};

export default ChenalDetails;
