import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "./socket"; // import the singleton socket instance
import "../styles/chatpage.css";
import { backendUrl } from "../App";

const ChatPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserIdAndFriend = async () => {
      const token = localStorage.getItem("token");

      try {
        const userProfileResponse = await axios.get(
          backendUrl + "/api/profile",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserId(userProfileResponse.data.userId);

        const friendResponse = await axios.get(
           `${backendUrl}/api/messages/${friendId}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        setFriend(friendResponse.data);

        const roomName = [userProfileResponse.data.userId, friendId]
          .sort()
          .join("_");
        socket.emit("join", {
          userId: userProfileResponse.data.userId,
          friendId,
        });
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response ? err.response.data : err.message
        );
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUserIdAndFriend();

    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === newMessage._id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [friendId, navigate, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${backendUrl}/api/messages/conversation/${friendId}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        setMessages(response.data); // Set the fetched messages to state
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err.response ? err.response.data : err.message
        );
      }
    };

    fetchMessages();
  }, [friendId]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const currentTime = new Date().toISOString();
    const newMessage = {
      friendId,
      userId,
      message,
      timestamp: currentTime,
    };

    socket.emit("sendMessage", newMessage);

    setMessage("");
  };

  if (!friend) return <p>Loading...</p>;

  return (
    <div className="chat-page">
      <div className="chat-header">
        <img
          src={`${backendUrl}/${friend.profilePicture}`}
          alt={friend.username}
          className="chat-header-profile-picture"
        />
        <h2 onClick={() => navigate(`/chat-friend-profile/${friend._id}`)} className="chat-header-username">{friend.username}</h2>
        <button
          onClick={() => navigate("/messages")}
          className="chat-header-back-button"
        >
          Back
        </button>
      </div>

      <div className="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-container ${
              msg.userId === userId ? "sent" : "received"
            }`}
          >
            <div className="message-bubble">
              {msg.message}
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-section">
        <input
          type="text"
          placeholder="Type a message..."
          className="chat-input-field"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage} className="chat-send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
