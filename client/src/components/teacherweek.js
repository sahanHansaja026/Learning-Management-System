import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/weeks.css";

const AddPage = ({ setCardId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (setCardId) {
      setCardId(id);
    }
  }, [id, setCardId]);

  const handleCreateActivity = () => {
    navigate(`/add/${id}`);
  };

  return (
    <div className="weeks">
      {/* <p>Your unique post ID is: {id}</p> */}
      <div className="weekshow">
        <button className="btn btn-success" onClick={handleCreateActivity}>
          <i className="fa fa-plus"></i>&nbsp;Create New Activity
        </button>
      </div>
    </div>
  );
};

export default AddPage;
