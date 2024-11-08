import React, { Component } from "react";
import axios from "axios";
import { FaShareAlt, FaWhatsapp, FaEnvelope, FaLink } from "react-icons/fa";
import Hero from "../images/happystudent.png";
import Happy from "../images/Graduation-bro.svg";
import "../css/newhome.css";
import authService from "../services/authService";

export default class home_page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      postsPerPage: 3,
      username: "",
      email: "",
      shareMenuVisible: null, // Track which card's share menu is open
    };
  }

  componentDidMount() {
    this.retrievePosts();
    this.fetchUserData();
  }

  async fetchUserData() {
    try {
      const userData = await authService.getUserData();
      this.setState({
        username: userData.username,
        email: userData.email,
      });
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  }

  retrievePosts(page = 1) {
    const { postsPerPage } = this.state;
    axios
      .get(`http://localhost:9001/posts?page=${page}&limit=${postsPerPage}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            posts: res.data.existingPosts,
            currentPage: page,
            totalPages: Math.ceil(res.data.totalPosts / postsPerPage),
          });
        } else {
          console.error("Error fetching posts:", res.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  toggleShareMenu = (cardId) => {
    this.setState((prevState) => ({
      shareMenuVisible: prevState.shareMenuVisible === cardId ? null : cardId,
    }));
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  renderPagination() {
    const { currentPage, totalPages } = this.state;
    const pages = [];
    const maxVisiblePages = 3;

    if (currentPage > 1) {
      pages.push(
        <button
          key={1}
          className={`pagination-button ${1 === currentPage ? "active" : ""}`}
          onClick={() => this.retrievePosts(1)}
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
          onClick={() => this.retrievePosts(i)}
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
          onClick={() => this.retrievePosts(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => this.retrievePosts(currentPage - 1)}>
            Previous
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => this.retrievePosts(currentPage + 1)}>
            Next
          </button>
        )}
      </div>
    );
  }

  truncateSummary(summary, maxLength = 100) {
    if (summary.length > maxLength) {
      return `${summary.substring(0, maxLength)}...`;
    }
    return summary;
  }

  render() {
    const { posts, username, email, shareMenuVisible } = this.state;
    return (
      <div className="newhome">
        <div className="herobox">
          <div className="content">
            <h1>Develop your skills in a new and unique way</h1>
            <p>
              Module Mate is your platform for learning and growth, offering
              tailored educational modules, skilled instructors, and interactive
              assignments. Whether you're a student or a teacher, discover the
              tools you need for a rewarding journey. Start today and unlock new
              possibilities!
            </p>
          </div>
          <div className="dashline">
            <div className="heroimage">
              <img src={Hero} alt="Student illustration" />
            </div>
          </div>
        </div>
        <div className="powerd">
          <h2>Mark Technologies</h2>
          <h2>LinkedIn</h2>
          <h2>Facebook</h2>
          <h2>OpenAI</h2>
        </div>
        <div className="bodycontent">
          <div className="subbodycontent">
            <img src={Happy} alt="Student illustration" />
            <div className="headh1">
              <h1
                style={{
                  color: "purple",
                  display: "inline", // Make this <h1> display inline
                  marginRight: "5px", // Optional spacing between the two parts
                }}
              >
                Benefits
              </h1>
              <h1
                style={{
                  color: "black", // Set a different color for the second part
                  display: "inline", // Make this <h1> display inline
                }}
              >
                From Our Online Learning
              </h1>
              <ul>
                <li>
                  <strong>Flexible Learning:</strong>
                  <br />
                  Access modules anytime, anywhere, at your own pace.
                </li>
                <li>
                  <strong>Interactive Content:</strong>
                  <br />
                  Engage with quizzes, assignments, and discussions for a
                  hands-on learning experience.
                </li>
                <li>
                  <strong>Expert Instructors:</strong>
                  <br />
                  Learn from skilled professionals with real-world experience in
                  various fields.
                </li>
                <li>
                  <strong>Personalized Experience:</strong>
                  <br />
                  Tailor your learning path to suit your goals and learning
                  style.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hh">
          <h1>
            <i>Discover Courses to Elevate Your Learning</i>
          </h1>
          <p>
            Browse through our extensive collection of courses designed to help
            you learn, grow, and succeed. Find the perfect course to match your
            interests and goals!
          </p>
          <br />
        </div>

        <div className="card-container">
          {posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((post) => (
              <div className="card" key={post.card_id}>
                <a
                  href={`/enrollestudent/${post.card_id}`}
                  className="card-link"
                >
                  {shareMenuVisible === post.card_id && (
                    <div className="share-options">
                      <button
                        onClick={() =>
                          this.copyToClipboard(
                            `${window.location.origin}/enrollestudent/${post.card_id}`
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
                    <p>{this.truncateSummary(post.summery, 100)}</p>
                  </div>
                </a>
                <div className="share-icon">
                  <FaShareAlt
                    color="white"
                    onClick={() => this.toggleShareMenu(post.card_id)}
                  />
                </div>
              </div>
            ))}
        </div>
        {this.renderPagination()}
      </div>
    );
  }
}
