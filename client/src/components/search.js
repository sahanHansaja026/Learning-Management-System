import React, { useState } from "react";
import axios from "axios";
import "../css/search.css";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      axios
        .post("http://localhost:9001/search", { title: query })
        .then((res) => {
          if (res.data.success) {
            setPosts(res.data.existingPosts);
            setErrorMessage("");
          } else {
            setErrorMessage(res.data.error);
            setPosts([]);
          }
        })
        .catch((error) => {
          console.error("Error searching for module or card:", error);
          setErrorMessage("Error. Unable to search for the module .");
          setPosts([]);
        });
    } else {
      setPosts([]); // Clear results if search query is empty
      setErrorMessage("");
    }
  };

  return (
    <div className="search">
      {/* Search Bar */}
      <form className="search-form">
        <input
          type="text"
          placeholder="Search Subject or Module Name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>

      {/* Display error message if search fails */}
      {errorMessage && <div className="error">{errorMessage}</div>}

      {/* Display the searched modules details */}
      <div className="card-container">
        {posts.map((post) => (
          <a href={`/teacherweek/${post.card_id}`} className="card" key={post.card_id}>
            <div className="card-image">
              <img
                src={post.image ? `http://localhost:9001/Uploads/${post.image}` : ""}
                alt={post.image ? post.image : "No Image"}
              />
            </div>
            <div className="card-header">
              <h3>{post.title}</h3>
              <p>{post.summery}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Search;
