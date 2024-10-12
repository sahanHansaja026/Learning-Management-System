import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate for redirection
import "../css/weeks.css";
import authService from "../services/authService";
import {
  FaPlus,
  FaFileAlt,
  FaVideo,
  FaStickyNote,
  FaClipboardList,
} from "react-icons/fa";

const AddPage = ({ setCardId }) => {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    if (setCardId) {
      setCardId(id);
    }

    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9001/postes/${id}`);
        if (response.data.success) {
          setPost(response.data.post);
        } else {
          setErrorMessage("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
        setErrorMessage("Error fetching post details");
      } finally {
        setPostLoading(false);
      }
    };

    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9001/activities/${id}`
        );
        if (response.data.success) {
          setAssignments(response.data.posts);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        setErrorMessage("Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setEmail(userData.email);
      } catch (error) {
        setErrorMessage("Failed to fetch user data");
      }
    };

    fetchPostDetails();
    fetchAssignments();
    fetchUserData();
  }, [id, setCardId]);

  const handleCreateActivity = () => {
    window.location.href = `/add/${id}`;
  };

  const handleQuizClick = (quiz_id) => {
    navigate(`/quiz/${quiz_id}`); // Use navigate for redirection
  };

  return (
    <div className="weeks">
      <div className="weekshow">
        {post && post.email === email && (
          <button className="btn-create" onClick={handleCreateActivity}>
            <FaPlus /> Create New Activity
          </button>
        )}
      </div>

      {postLoading ? (
        <p>Loading post details...</p>
      ) : post ? (
        <div className="post-details">
          <p>{post.title}</p>
        </div>
      ) : (
        <p>{errorMessage}</p>
      )}

      {loading ? (
        <p>Loading assignments...</p>
      ) : (
        <div className="assignments-container">
          {assignments.length === 0 ? (
            <p>No assignments found for this card_id</p>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="assignment-header">
                  <p className="assignment-date">
                    {new Date(assignment.createdAt).toLocaleString()}
                  </p>
                  <hr />
                  <h3 style={{ color: "red" }}>{assignment.assignment_name}</h3>
                </div>
                <div className="assignment-body">
                  {assignment.assignment && (
                    <p style={{ color: "red" }}>
                      <FaFileAlt style={{ color: "red" }} /> Assignment File:{" "}
                      <a
                        href={`http://localhost:9001/Assignmentfile/${assignment.assignment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "red" }}
                      >
                        Download Assignment
                      </a>
                    </p>
                  )}
                  {assignment.video_name && assignment.video && (
                    <div>
                      <h3>
                        <FaVideo /> Video: {assignment.video_name}
                      </h3>
                      <p>
                        Video File:{" "}
                        <a
                          href={`http://localhost:9001/VideoFile/${assignment.video}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Video
                        </a>
                      </p>
                    </div>
                  )}
                  {assignment.note_name && assignment.note && (
                    <div>
                      <h3>
                        <FaStickyNote /> Notes: {assignment.note_name}
                      </h3>
                      <p>
                        Notes File:{" "}
                        <a
                          href={`http://localhost:9001/NotesFile/${assignment.note}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Notes
                        </a>
                      </p>
                    </div>
                  )}
                  {assignment.quiz_name &&
                    assignment.description &&
                    assignment.quiz_id && (
                      <div style={{ display: "flex" }}>
                        <p
                          style={{
                            color: "red",
                            display: "flex",
                            fontSize: "10px",
                          }}
                        >
                          <FaClipboardList
                            onClick={() => handleQuizClick(assignment.quiz_id)}
                            className="quiz-title"
                            style={{ color: "red", marginRight: "10px" }}
                          ></FaClipboardList>
                        </p>
                        <h3 style={{ color: "red", marginTop:"8px" }}>{assignment.quiz_name}</h3>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddPage;
