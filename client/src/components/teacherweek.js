import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/weeks.css";
import { FaPlus, FaFileAlt, FaVideo } from "react-icons/fa"; // Icon imports

const AddPage = ({ setCardId }) => {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (setCardId) {
      setCardId(id); // Passing card_id to parent if necessary
    }

    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:9001/activities/${id}`);
        if (response.data.success) {
          setAssignments(response.data.posts);
        } else {
          setAssignments([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [id, setCardId]);

  const handleCreateActivity = () => {
    window.location.href = `/add/${id}`;
  };

  return (
    <div className="weeks">
      <div className="weekshow">
        <button className="btn-create" onClick={handleCreateActivity}>
          <FaPlus /> Create New Activity
        </button>
      </div>

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
                  <h3>{assignment.assignment_name}</h3>
                </div>
                <div className="assignment-body">
                  {assignment.assignment && (
                    <p>
                      <FaFileAlt /> Assignment File:{" "}
                      <a
                         href={`http://localhost:9001/Assignmentfile/${assignment.assignment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Assignment
                      </a>
                    </p>
                  )}
                  {assignment.video_name && assignment.video && (
                    <div>
                      <p>
                        <FaVideo /> Video: {assignment.video_name}
                      </p>
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
