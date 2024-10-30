import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/addfriend.css';
import Navbar from './Navbar';
import Menu from './Menu';
import FriendsSideBar from './FriendsSideBar';
import { backendUrl } from '../App';

const MyFriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate(); 
  
  useEffect(() => {
    axios.get(backendUrl + '/api/friends', { headers: { 'x-auth-token': localStorage.getItem('token') } })
      .then(response => {
        setFriends(response.data);
        setLoading(false); // Stop loading once friends are fetched
        
      })
      .catch(error => {
        console.error('There was an error fetching the friends!', error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  console.log(friends);

  return (
    <>
      <Navbar />
      <Menu />

      <div className="home2">
        <FriendsSideBar /> 

        <div className='content-section'>
          <h1 className="content-header">My Friends</h1>
          <div className="add-friend-page">
            {loading ? (
              <p>Loading friends...</p> // Show loading message while fetching data
            ) : friends.length > 0 ? (
              
              friends.map(friend => (
                
                
                <div key={friend._id} className="user-card">
                  
                  <img 
                    src={`${backendUrl}/${friend.profilePicture}`} 
                    alt={friend.username} 
                    className="add-friend-profile-picture"
                  />
                  <p>{friend.username}</p>
                  <button
                    onClick={() => navigate(`/friend-profile/${friend._id}`)} // Use navigate to direct to the friend's profile
                    className="add-friend-buttons"
                  >
                    Show Profile
                  </button>
                </div>
              ))
            ) : (
              <p>You have no friends yet.</p> // Show this only when loading is false and friends list is empty
            )}
          </div>
        </div>
      </div>
    </>
    
  );
}; 

export default MyFriendsPage;
