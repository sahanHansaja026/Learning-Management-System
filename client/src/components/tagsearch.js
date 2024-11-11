import React, { useState } from "react";


const TagsSearch = ({ setSelectedTags }) => {
  const [tags, setTags] = useState([
    "Data Science",
    "Web Development",
    "Business",
    "Design",
    "Health",
    "AI",
    "Marketing",
    "Finance",
  ]);
  const [activeTags, setActiveTags] = useState([]);

  const toggleTag = (tag) => {
    let updatedTags;

    if (activeTags.includes(tag)) {
      updatedTags = activeTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...activeTags, tag];
    }

    setActiveTags(updatedTags);
    setSelectedTags(updatedTags); // Update parent component with selected tags
  };

  return (
    <div className="tags-search">
      <h4>Filter by Tags</h4>
      <div className="tags-container">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${activeTags.includes(tag) ? "active" : ""}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Display selected tags */}
      {activeTags.length > 0 && (
        <div className="selected-tags">
          <h5>Selected Filters:</h5>
          {activeTags.map((tag) => (
            <span key={tag} className="selected-tag">
              {tag} <button onClick={() => toggleTag(tag)}>x</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsSearch;
