import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/weeks.css";
import Message from "./message";
import authService from "../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
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
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cmsName, setCmsName] = useState("");
  const [progress, setProgress] = useState({});
  const [view, setView] = useState("details"); // Tracks the current view: "details" or "message"
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
          setSelectedMaterial(response.data.posts[0] || null); // Default to the first material
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
            console.error(
              `Error fetching progress for ${assignment._id}:`,
              error
            );
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

  const handleMaterialClick = (material) => {
    setView("details"); // Switch back to details view
    setSelectedMaterial(material);
  };

  const handleQuizClick = (quiz_id) => {
    markProgress(quiz_id);
    navigate(`/quiz/${quiz_id}`);
  };
  const handleVedioEditClick = (video_id) => {
    markProgress(video_id);
    navigate(`/vdiosedit/${video_id}`);
  };
  const handleCMSClick = (CMS_id) => {
    markProgress(CMS_id);
    navigate(`/WriteCMS/${CMS_id}`);
  };

  const handleclicknavigate = () => {
    setView("message"); // Switch to message view
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

  return (
    <div className="page-container">
      <div className="sidebar">
        <h3>Course Materials</h3>
        <ul>
          {assignments.map((assignment) => (
            <li
              key={assignment._id}
              className={
                assignment._id === selectedMaterial?._id ? "active" : ""
              }
              onClick={() => handleMaterialClick(assignment)}
            >
              {assignment.assignment_name ||
                assignment.video_name ||
                assignment.note_name ||
                assignment.quiz_name ||
                assignment.CMS_name ||
                "Untitled Material"}
            </li>
          ))}
          <li onClick={handleclicknavigate}>Chat & Feedback</li>
        </ul>
        {post && post.email === email && (
          <button className="btn-create" onClick={handleCreateActivity}>
            <FaPlus /> Create New Activity
          </button>
        )}
      </div>

      <div className="content">
        {view === "details" ? (
          loading ? (
            <p>Loading assignments...</p>
          ) : selectedMaterial ? (
            <div className="assignment-details">
              <h2>{selectedMaterial.assignment_name}</h2>

              {selectedMaterial.assignment && (
                <p>
                  <FaFileAlt /> Assignment File:{" "}
                  <a
                    href={`http://localhost:9001/Assignmentfile/${selectedMaterial.assignment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Assignment
                  </a>
                </p>
              )}

              {selectedMaterial.video_name && selectedMaterial.video && (
                <div>
                  <div className="editandtitle">
                    {post && post.email === email && (
                      <button
                        className="three-dots-btn"
                        onClick={() =>
                          handleVedioEditClick(selectedMaterial.video_id)
                        }
                      >
                        <h4>Clik to Edit</h4>
                      </button>
                    )}

                    <h3> {selectedMaterial.video_name}</h3>
                  </div>

                  <video
                    width="1000"
                    height="fitcontent"
                    controls
                    onPlay={() => markProgress(selectedMaterial._id)}
                  >
                    <source
                      src={`http://localhost:9001/VideoFile/${selectedMaterial.video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {selectedMaterial.note_name && selectedMaterial.note && (
                <div>
                  <h3>
                    <FaStickyNote /> Notes: {selectedMaterial.note_name}
                  </h3>
                  <a
                    href={`http://localhost:9001/NotesFile/${selectedMaterial.note}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Notes
                  </a>
                </div>
              )}

              {selectedMaterial.CMS_name && (
                <div>
                  <h3>
                    <FaClipboardList /> CMS: {selectedMaterial.CMS_name}
                  </h3>
                  <button
                    className="btn-action"
                    onClick={() => handleCMSClick(selectedMaterial._id)}
                  >
                    Open CMS
                  </button>
                </div>
              )}

              {selectedMaterial.quiz_name && (
                <div>
                  <h3>
                    <FaClipboardList /> Quiz: {selectedMaterial.quiz_name}
                  </h3>
                  <div className="parbox">
                    <p>{selectedMaterial.description}</p>
                  </div>

                  <button
                    className="btn-action"
                    onClick={() => handleQuizClick(selectedMaterial.quiz_id)}
                  >
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Select a material to view its details</p>
          )
        ) : (
          <Message id={id} /> // Render Message component with module ID
        )}
      </div>
    </div>
  );
};

export default AddPage;
