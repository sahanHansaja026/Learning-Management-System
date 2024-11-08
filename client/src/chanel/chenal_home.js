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
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:9001/chnel/${id}`)
      .then((res) => {
        if (res.data.success) {
          setPost(res.data.post); // set post data when available
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });

    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, [id]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Check if user email matches admin email to conditionally render the Primary Admin tab
  const showPrimaryAdminTab = post?.email === email;

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
      </div>

      <div className="channel-details">
        <h2>Welcome, {username}!</h2>
        <p>User Email: {email}</p>
        <div className="admin-info">
          <h2>Channel Information</h2>
          <p>
            <strong>Admin Email:</strong> {post?.email}
          </p>
          <p>
            <strong>Channel ID:</strong> {post?.chenal_id}
          </p>
        </div>
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

      {/* Render Tabs */}
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

      {/* Render Tab Content */}
      {activeTab === "primaryAdmin" && <PrimaryAdmin />}
      {activeTab === "secondaryAdmin" && <SecondaryAdmin />}
    </div>
  );
};

export default ChenalDetails;
