import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import CreateProfile from "./components/CreateProfile";
import "./styles/App.css";
import Notifications from "./components/Notifications";
import AddFriendPage from "./components/AddFriendPage";
import UserProfilePage from "./components/UserProfilePage";
import FriendRequestsPage from "./components/FriendRequestsPage";
import MyFriendsPage from "./components/MyFriendsPage";
import MessagesPage from "./components/MessagesPage";
import ChatPage from "./components/ChatPage";
import ModifyProfile from "./components/ModifyProfile";
import FriendProfile from "./components/FriendProfile";
import CreatePost from "./components/CreatePost";
import ChatFriendProfile from "./components/ChatFriendProfile";
import Settings from "./components/Settings";
import Friends from "./components/Friends";
import Birthdays from "./components/Birthdays";
import BirthdayPost from "./components/BirthdayPost";

export const backendUrl = import.meta.env.VITE_BACKEND_URL
console.log(backendUrl);

function App() {
  const [posts, setPosts] = useState([]);

  // Function to handle new birthday post
  const addNewBirthdayPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  return (
    <Router>
      <div className="home1">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/modify-profile" element={<ModifyProfile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/addfriends" element={<AddFriendPage />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route path="/friend-request" element={<FriendRequestsPage />} />
          <Route path="/my-friends" element={<MyFriendsPage />} />
          <Route path="/friend-profile/:id" element={<FriendProfile />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/birthday-post/:friendId/:friendUsername"element={<BirthdayPost addNewBirthdayPost={addNewBirthdayPost} />}/>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/chat/:friendId" element={<ChatPage />} />
          <Route path="/chat-friend-profile/:id" element={<ChatFriendProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
