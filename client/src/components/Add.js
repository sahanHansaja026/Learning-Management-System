import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/item.css";

const AddPage = ({ setCardId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (setCardId) {
      setCardId(id);
    }
  }, [id, setCardId]);

  const handleCreateActivity1 = () => {
    navigate(`/add_assingment/${id}`);
  };
  const handleCreateActivity2 = () => {
    navigate(`/add_quiz/${id}`);
  };
  const handleCreateActivity3 = () => {
    navigate(`/add_vedio/${id}`);
  };
  const handleCreateActivity4 = () => {
    navigate(`/add_note/${id}`);
  };
  const handleCreateActivity5 = () => {
    navigate(`/add_cms/${id}`);
  };
  return (
    <div className="item">
      {/* <p>Your unique post ID is: {id}</p> */}
      <button className="btn btn-success" onClick={handleCreateActivity1}>
        <i className="fa fa-plus"></i>&nbsp;Add Assignment
      </button>
      <br />
      <button className="btn btn-success" onClick={handleCreateActivity2}>
        <i className="fa fa-plus"></i>&nbsp;Add Quiz
      </button>
      <br />
      <button className="btn btn-success" onClick={handleCreateActivity3}>
        <i className="fa fa-plus"></i>&nbsp;Add video
      </button>
      <br />
      <button className="btn btn-success" onClick={handleCreateActivity4}>
        <i className="fa fa-plus"></i>&nbsp;Add Lecher Note
      </button>
      <br/>
      <button className="btn btn-success" onClick={handleCreateActivity5}>
        <i className="fa fa-plus"></i>&nbsp;Add CMS
      </button>
    </div>
  );
};

export default AddPage;
