import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import authService from "../services/authService";
import "../css/chenal_details.css"; // Add CSS file

const ChenalDetails = () => {
  const [post, setPost] = useState({});
  const [username, setUsername] = useState(""); // State for authenticated user name
  const [email, setEmail] = useState(""); // State for authenticated user email
  const { id } = useParams();

  useEffect(() => {
    // Fetch post details
    axios
      .get(`http://localhost:9001/chenel/${id}`)
      .then((res) => {
        if (res.data.success) {
          setPost(res.data.post);
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });

    // Fetch user data from authService
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

  return (
    <div className="channel-page">
      {/* Banner Image */}
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

      {/* Channel Details */}
      <div className="channel-details">
        <div className="admin-info">
          <h2>Channel Information</h2>
          <p>
            <strong>Admin Email:</strong> {post.email}
          </p>
          <p>
            <strong>Channel ID:</strong> {post.chenal_id}
          </p>
          <p>
            <strong>Summary:</strong> {post.summery}
          </p>
        </div>

        {/* Summary Section */}
        <div className="channel-summary">
          <h3>About This Channel</h3>
          <p>{post.summery}</p>
        </div>

        {/* Welcome Message with Username and Email */}
        <div className="user-welcome">
          <h2>Welcome, {username}!</h2>
          <p>Your email: {email}</p>
        </div>
      </div>
    </div>
  );
};

export default ChenalDetails;
