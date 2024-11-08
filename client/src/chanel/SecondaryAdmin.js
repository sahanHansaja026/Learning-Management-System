import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShareAlt, FaWhatsapp, FaEnvelope, FaLink } from "react-icons/fa";
import "../css/home.css";
import authService from "../services/authService";

const ModuleView = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 3;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [shareMenuVisible, setShareMenuVisible] = useState(null);

  useEffect(() => {
    retrievePosts();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await authService.getUserData();
      setUsername(userData.username);
      setEmail(userData.email);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const retrievePosts = (page = 1) => {
    axios
      .get(
        `http://localhost:9001/chenalposts?page=${page}&limit=${postsPerPage}`
      )
      .then((res) => {
        if (res.data.success) {
          setPosts(res.data.existingPosts);
          setCurrentPage(page);
          setTotalPages(Math.ceil(res.data.totalPosts / postsPerPage));
        } else {
          console.error("Error fetching posts:", res.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const toggleShareMenu = (cardId) => {
    setShareMenuVisible(shareMenuVisible === cardId ? null : cardId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;

    if (currentPage > 1) {
      pages.push(
        <button
          key={1}
          className={`pagination-button ${1 === currentPage ? "active" : ""}`}
          onClick={() => retrievePosts(1)}
        >
          1
        </button>
      );
    }

    if (currentPage > maxVisiblePages + 1) {
      pages.push(<span key="left-ellipsis">...</span>);
    }

    for (
      let i = Math.max(2, currentPage - maxVisiblePages);
      i <= Math.min(totalPages - 1, currentPage + maxVisiblePages);
      i++
    ) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === currentPage ? "active" : ""}`}
          onClick={() => retrievePosts(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - maxVisiblePages) {
      pages.push(<span key="right-ellipsis">...</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`pagination-button ${
            totalPages === currentPage ? "active" : ""
          }`}
          onClick={() => retrievePosts(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => retrievePosts(currentPage - 1)}>
            Previous
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => retrievePosts(currentPage + 1)}>Next</button>
        )}
      </div>
    );
  };

  const truncateSummary = (summary, maxLength = 100) => {
    if (summary.length > maxLength) {
      return `${summary.substring(0, maxLength)}...`;
    }
    return summary;
  };

  return (
    <div className="home">
      <h2>Welcome, {username}!</h2>
      <div className="card-container">
        {posts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((post) => (
            <div className="card" key={post.card_id}>
              <a
                href={`/chenalenrollement/${post.card_id}`}
                className="card-link"
              >
                {shareMenuVisible === post.card_id && (
                  <div className="share-options">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/chenalenrollement/${post.card_id}`
                        )
                      }
                      className="share-option"
                    >
                      <FaLink color="white" /> URL
                    </button>
                    <a
                      href={`https://wa.me/?text=Check out this module: ${window.location.origin}/enrollestudent/${post.card_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-option"
                    >
                      <FaWhatsapp color="white" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:?subject=Check out this module&body=Here is a link to the module: ${window.location.origin}/enrollestudent/${post.card_id}`}
                      className="share-option"
                    >
                      <FaEnvelope color="white" /> Email
                    </a>
                  </div>
                )}
                <div className="card-image">
                  <img
                    src={
                      post.image
                        ? `http://localhost:9001/Uploads/${post.image}`
                        : ""
                    }
                    alt={post.image ? post.image : "No Image"}
                  />
                </div>
                <div className="card-header">
                  <h3>{post.title}</h3>
                  <p>{truncateSummary(post.summery, 100)}</p>
                </div>
              </a>
              <div className="share-icon">
                <FaShareAlt
                  color="white"
                  onClick={() => toggleShareMenu(post.card_id)}
                />
              </div>
            </div>
          ))}
      </div>
      {renderPagination()}
    </div>
  );
};

export default ModuleView;
