import React, { Component } from "react";
import axios from "axios";
import "../css/home.css";
import authService from "../services/authService";
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enrollments: [],
      email: "",
      currentPage: 1,
      totalPages: 1,
      enrollmentsPerPage: 3, // Adjust to how many enrollments you want per page
      posts: {}, // Store posts for each card_id here
    };
  }

  async componentDidMount() {
    const userData = await authService.getUserData(); // Assuming this returns user's email
    this.setState({ email: userData.email });

    this.retrieveEnrollmentsByEmail(userData.email);
  }

  // Fetch enrollments based on the user's email
  retrieveEnrollmentsByEmail(email, page = 1) {
    const { enrollmentsPerPage } = this.state;

    axios
      .get(`http://localhost:9001/enrollments/${email}?page=${page}&limit=${enrollmentsPerPage}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            enrollments: res.data.enrollments,
            currentPage: page,
            totalPages: Math.ceil(res.data.enrollments.length / enrollmentsPerPage),
          }, () => {
            // After fetching enrollments, fetch posts for each enrollment
            this.fetchPostsForEnrollments(res.data.enrollments);
          });
        } else {
          console.error("Error fetching enrollments:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching enrollments:", error);
      });
  }

  // Fetch posts for each enrollment
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
          console.error("Error fetching posts for card_id:", enrollment.card_id, error);
        });
    });
  }

  // Helper function to truncate the summary text
  truncateSummary(text, length) {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  }

  renderPagination() {
    const { currentPage, totalPages } = this.state;
    const pages = [];
    const maxVisiblePages = 3;

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
          onClick={() => this.retrieveEnrollmentsByEmail(this.state.email, i)}
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
          className={`pagination-button ${totalPages === currentPage ? "active" : ""}`}
          onClick={() => this.retrieveEnrollmentsByEmail(this.state.email, totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => this.retrieveEnrollmentsByEmail(this.state.email, currentPage - 1)}>
            Previous
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => this.retrieveEnrollmentsByEmail(this.state.email, currentPage + 1)}>
            Next
          </button>
        )}
      </div>
    );
  }

  render() {
    const { enrollments, posts } = this.state;

    // Convert the posts object into an array and sort them by date
    const postArray = Object.values(posts).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div className="enrolle">
        <h1 style={{ color: "white", fontWeight:"bold" }}>My Enrollments</h1>
        <div className="card-container">
          {postArray.length > 0 ? (
            postArray.map((post) => (
              <a
                href={`/teacherweek/${post.card_id}`}
                className="card"
                key={post.card_id}
              >
                <div className="card-image">
                  <img
                    src={
                      post.image
                        ? `http://localhost:9001/Uploads/${post.image}`
                        : "default-image.jpg" // Fallback image if no image
                    }
                    alt={post.image ? post.image : "No Image"}
                  />
                </div>
                <div className="card-header">
                  <h3>{post.title}</h3>
                  <p>{this.truncateSummary(post.summery, 100)}</p>
                </div>
              </a>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>

        <br />

        {/* Render pagination */}
        {this.renderPagination()}
      </div>
    );
  }
}
