import React, { useState, useEffect } from 'react';
import authService from "../services/authService";  // Adjust this to the correct path
import axios from 'axios';
import "../css/my_module.css"

const MyModule = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);  // State to hold posts
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [currentPage, setCurrentPage] = useState(1);  // Track the current page
  const [totalPages, setTotalPages] = useState(1);  // Total number of pages

  // Fetch user data and posts when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await authService.getUserData();
        setUsername(userData.username);
        setEmail(userData.email);

        // Fetch posts for the current user by email and page
        const response = await axios.get(`http://localhost:9001/posts/${userData.email}?page=${currentPage}&limit=10`);
        setPosts(response.data.existingPosts);  // Set the posts state
        setTotalPages(response.data.totalPages);  // Set total pages

        setLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        console.error('Failed to fetch data', error);
        setLoading(false);  // Ensure loading is stopped even if there's an error
      }
    };

    fetchData();
  }, [currentPage]);  // Re-fetch data when currentPage changes

  // Truncate the summary text
  const truncateSummary = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      
      <div className="card-container">
        {posts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((post) => (
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
          ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={currentPage === page + 1 ? 'active' : ''}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyModule;
