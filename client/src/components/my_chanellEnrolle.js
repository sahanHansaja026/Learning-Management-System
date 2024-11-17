import React, { Component } from "react";
import axios from "axios";
import "../css/home.css";
import authService from "../services/authService";
import { Link } from "react-router-dom";
import { FaShareAlt, FaWhatsapp, FaEnvelope, FaLink } from "react-icons/fa";

export default class MYChanels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enrollments: [],
      email: "",
      currentPage: 1,
      totalPages: 1,
      enrollmentsPerPage: 3,
      posts: {},
      shareMenuVisible: null, // Track which post’s share menu is open
    };
  }

  async componentDidMount() {
    const userData = await authService.getUserData();
    this.setState({ email: userData.email });

    this.retrieveEnrollmentsByEmail(userData.email);
  }

  retrieveEnrollmentsByEmail(email, page = 1) {
    const { enrollmentsPerPage } = this.state;

    axios
      .get(
        `http://localhost:9001/enrollments/${email}?page=${page}&limit=${enrollmentsPerPage}`
      )
      .then((res) => {
        if (res.data.success) {
          const totalItems = res.data.totalCount; // Assuming `totalCount` is returned by the backend
          this.setState(
            {
              enrollments: res.data.enrollments,
              currentPage: page,
              totalPages: Math.ceil(totalItems / enrollmentsPerPage),
            },
            () => {
              this.fetchPostsForEnrollments(res.data.enrollments);
            }
          );
        } else {
          console.error("Error fetching enrollments:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching enrollments:", error);
      });
  }

  fetchPostsForEnrollments(enrollments) {
    const posts = {};
    enrollments.forEach((enrollment) => {
      axios
        .get(`http://localhost:9001/postes/${enrollment.card_id}`)
        .then((res) => {
          if (res.data.success && res.data.post) {
            posts[enrollment.card_id] = res.data.post;
            this.setState({ posts });
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching posts for card_id:",
            enrollment.card_id,
            error
          );
        });
    });
  }

  truncateSummary(text, length) {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
  }

  toggleShareMenu = (postId) => {
    this.setState((prevState) => ({
      shareMenuVisible: prevState.shareMenuVisible === postId ? null : postId,
    }));
  };

  copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  renderPagination() {
    const { currentPage, totalPages } = this.state;
    const pages = [];
    const maxVisiblePages = 3;

    // Add the "First" page
    if (currentPage > 1) {
      pages.push(
        <button
          key={1}
          className={`pagination-button ${1 === currentPage ? "active" : ""}`}
          onClick={() => this.retrieveEnrollmentsByEmail(this.state.email, 1)}
        >
          1
        </button>
      );
    }

    // Add ellipsis if needed
    if (currentPage > maxVisiblePages + 1) {
      pages.push(<span key="left-ellipsis">...</span>);
    }

    // Add middle pages
    for (
      let i = Math.max(2, currentPage - maxVisiblePages);
      i <= Math.min(totalPages - 1, currentPage + maxVisiblePages);
      i++
    ) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === currentPage ? "active" : ""}`}
          onClick={() => this.retrieveEnrollmentsByEmail(this.state.email, i)}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - maxVisiblePages) {
      pages.push(<span key="right-ellipsis">...</span>);
    }

    // Add the "Last" page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`pagination-button ${
            totalPages === currentPage ? "active" : ""
          }`}
          onClick={() =>
            this.retrieveEnrollmentsByEmail(this.state.email, totalPages)
          }
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button
            onClick={() =>
              this.retrieveEnrollmentsByEmail(this.state.email, currentPage - 1)
            }
          >
            Previous
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button
            onClick={() =>
              this.retrieveEnrollmentsByEmail(this.state.email, currentPage + 1)
            }
          >
            Next
          </button>
        )}
      </div>
    );
  }

  render() {
    const { enrollments, posts, shareMenuVisible } = this.state;
    const postArray = Object.values(posts).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return (
      <div className="enrolle">
        <div className="card-container">
          {postArray.length > 0 ? (
            postArray.map((post) => (
              <div className="card" key={post.card_id}>
                <a href={`/teacherweek/${post.card_id}`} className="card-link">
                  <div className="card-image">
                    <img
                      src={
                        post.image
                          ? `http://localhost:9001/Uploads/${post.image}`
                          : "default-image.jpg"
                      }
                      alt={post.image ? post.image : "No Image"}
                    />
                  </div>
                  <div className="card-header">
                    <h3>{post.title}</h3>
                    <p>{this.truncateSummary(post.summery, 100)}</p>
                  </div>
                </a>

                {/* Share Icon */}
                <div
                  className="share-icon"
                  onClick={() => this.toggleShareMenu(post.card_id)}
                >
                  <FaShareAlt color="white" />
                </div>

                {/* Share Menu */}
                {shareMenuVisible === post.card_id && (
                  <div className="share-options">
                    <button
                      onClick={() =>
                        this.copyToClipboard(
                          `${window.location.origin}/teacherweek/${post.card_id}`
                        )
                      }
                      className="share-option"
                    >
                      <FaLink color="white" /> Copy Link
                    </button>
                    <a
                      href={`https://wa.me/?text=Check out this module: ${window.location.origin}/teacherweek/${post.card_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-option"
                    >
                      <FaWhatsapp color="white" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:?subject=Check out this module&body=Here is a link to the module: ${window.location.origin}/teacherweek/${post.card_id}`}
                      className="share-option"
                    >
                      <FaEnvelope color="white" /> Email
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>

        <br />

        {this.renderPagination()}
      </div>
    );
  }
}
