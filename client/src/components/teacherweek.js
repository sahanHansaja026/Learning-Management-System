import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  const [cmsName, setCmsName] = useState("");
  const [progress, setProgress] = useState({}); // Store progress data

  const navigate = useNavigate();

  useEffect(() => {
    if (setCardId) {
      setCardId(id);
    }

    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9001/postes/${id}`);
        if (response.data.success) {
          setPost(response.data.post);
          setCmsName(response.data.post.cmsName || "");
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

        // Fetch progress for each assignment
        const progressData = {};
        for (const assignment of assignments) {
          try {
            const res = await axios.get(
              `http://localhost:9001/user-activities/${userData.email}/${assignment._id}`
            );
            if (res.data.success) {
              progressData[assignment._id] = res.data.activity.completed;
            }
          } catch (error) {
            console.error(`Error fetching progress for ${assignment._id}:`, error);
          }
        }
        setProgress(progressData);
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
    markProgress(quiz_id);
    navigate(`/quiz/${quiz_id}`);
  };

  const handleCMSClick = (CMS_id) => {
    markProgress(CMS_id);
    navigate(`/WriteCMS/${CMS_id}`);
  };

  const markProgress = async (activity_id) => {
    try {
      await axios.post("http://localhost:9001/progress", {
        email,
        activity_id,
      });
      setProgress({ ...progress, [activity_id]: true });
    } catch (error) {
      console.error("Error marking progress:", error);
    }
  };

  const handleAssignmentClick = (assignment_id) => {
    markProgress(assignment_id);
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
          {cmsName && (
            <div
              className="cms-name"
              onClick={handleCMSClick}
              style={{ cursor: "pointer", color: "blue" }}
            >
              <h4>{cmsName}</h4>
            </div>
          )}
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
              <div
                key={assignment._id}
                className={`assignment-card ${progress[assignment._id] ? "completed" : ""}`}
                onClick={() => handleAssignmentClick(assignment._id)}
              >
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
                      <center>
                        <video
                          width="320"
                          height="240"
                          controls
                          style={{
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                          }}
                          onPlay={() => markProgress(assignment._id)}
                        >
                          <source
                            src={`http://localhost:9001/VideoFile/${assignment.video}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </center>
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
                          onClick={() => markProgress(assignment._id)}
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
                        <h3 style={{ color: "red", marginTop: "8px" }}>
                          {assignment.quiz_name}
                        </h3>
                      </div>
                    )}
                  {assignment.CMS_name &&
                    assignment.description &&
                    assignment.CMS_id && (
                      <div style={{ display: "flex" }}>
                        <p
                          style={{
                            color: "red",
                            display: "flex",
                            fontSize: "10px",
                          }}
                        >
                          <FaClipboardList
                            onClick={() => handleCMSClick(assignment.CMS_id)}
                            className="quiz-title"
                            style={{ color: "red", marginRight: "10px" }}
                          ></FaClipboardList>
                        </p>
                        <h3 style={{ color: "red", marginTop: "8px" }}>
                          Writing Assignment<br /> {assignment.CMS_name}
                        </h3>
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
