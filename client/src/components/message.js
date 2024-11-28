import React, { useState, useEffect } from "react";
import authService from "../services/authService";
import axios from "axios"; // Importing axios
import "../css/message.css";

function Message({ id, userEmail }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]); // State for holding fetched messages

  // Handle the form submission to save a new message
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      card_id: id,
      message: message,
    };

    try {
      // Sending the data to your backend to save the message
      const response = await axios.post(
        "http://localhost:9001/saveMessage",
        data
      );
      console.log("Message saved:", response.data);
      setMessage(""); // Reset the message input
      fetchMessages(); // Fetch the updated messages list after saving the new message
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  // Fetch messages for the given card_id
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9001/getMessages/${id}`
      );
      setMessages(response.data.messages); // Store the fetched messages in the state
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch user data (email, username) on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
    fetchMessages(); // Fetch messages when the component mounts
  }, [id]); // Refetch messages when `id` changes

  return (
    <div className="message-container">
      <div className="message-header">
        <h2>Send a Message</h2>
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          className="message-textarea"
        />
        <button type="submit" className="send-message-btn">
          Send Message
        </button>
      </form>

      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="message-item">
              <p>
                <strong>{msg.email}</strong>: {msg.message}
              </p>
            </div>
          ))
        ) : (
          <p>No messages available for this card.</p>
        )}
      </div>
    </div>
  );
}

export default Message;
