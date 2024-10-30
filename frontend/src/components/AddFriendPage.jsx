import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/addfriend.css';
import Navbar from './Navbar';
import Menu from './Menu';
import FriendsSideBar from './FriendsSideBar';
import { backendUrl } from "../App";


const AddFriendPage = () => {
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch all users except friends from the server
    axios
      .get(backendUrl + "/api/users", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });

    // Fetch sent friend requests
    axios
      .get(backendUrl + "/api/friends/requests", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setSentRequests(response.data.map((request) => request._id));
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the friend requests!",
          error
        );
      });
  }, []);

  const handleSendRequest = (userId) => {
    axios
      .post(
        backendUrl + "/api/friends/request",
        { targetUserId: userId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      )
      .then(() => {
        setSentRequests([...sentRequests, userId]);
      })
      .catch((error) => {
        console.error("There was an error sending the friend request!", error);
      });
  };

  const handleCancelRequest = (userId) => {
    axios
      .post(
        backendUrl + "/api/friends/cancel",
        { targetUserId: userId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      )
      .then(() => {
        setSentRequests(sentRequests.filter((id) => id !== userId));
      })
      .catch((error) => {
        console.error(
          "There was an error canceling the friend request!",
          error
        );
      });
  };

  return (
    <>

<Navbar />
<Menu />
<div className="home2">
  <FriendsSideBar />
          <div className="content-section">
            <h1 className="content-header">add friends</h1>
            
            <div className="add-friend-page">
              {users.map((user) => (
                <div key={user._id} className="user-card">
                  <img
                    src={`${backendUrl}/${user.profilePicture}`}
                    alt={user.username}
                    className="add-friend-profile-picture"
                  />
                  <p>{user.username}</p>
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="add-friend-buttons"
                  >
                    Show Profile
                  </button>
                  {sentRequests.includes(user._id) ? (
                    <button
                      onClick={() => handleCancelRequest(user._id)}
                      className="cancel-request-button"
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      className="add-friend-buttons"
                    >
                      Send Request
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
</div>
    </>
  );
};

export default AddFriendPage;
