import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import ProfilePosts from './ProfilePosts'; // Reuse the same ProfilePosts component
import '../styles/userprofile.css'; // Create this file for styling
import "../styles/Profile.css";
import Navbar from "./Navbar";
import Menu from "./Menu";
import FriendsSideBar from "./FriendsSideBar";
import { backendUrl } from '../App';



const FriendProfile = () => {
  const { id } = useParams(); // Get the friend's ID from the URL
  const [friendProfile, setFriendProfile] = useState(null);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/profile/${id}/posts`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setFriendProfile(res.data); // Set the friend's profile data including posts
      } catch (err) {
        console.error('Error fetching friend profile:', err.response ? err.response.data : err.message);
      }
    };
    fetchFriendProfile();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log(friendProfile);

  return (
    <>
          <Navbar />
          <Menu />
      <div className="home2">
        
      <FriendsSideBar />
        {friendProfile ? (
          <div className='show-user-profile'>

            <div className="user-profile-page">
            <div className='user-profile-container'>
                  <div className='user-pictures'>
      {friendProfile.coverPicture && (
        
        <img 
          src={`${backendUrl}/${friendProfile.coverPicture}`} 
          alt="Cover" 
          className="user-cover-picture" 
        />
      )}
      <img 
        src={`${backendUrl}/${friendProfile.profilePicture}`} 
        alt={friendProfile.username} 
        className="user-profile-picture" 
      />
                  </div>
                  <div className='user-data'>
            <h1 className='user-data-username'> {friendProfile.username}</h1>
           < p> {formatDate(friendProfile.dob)}</p>
            <p> {friendProfile.phoneNumber}</p>
            <p> {friendProfile.nickname}</p>
            <p> {friendProfile.sex}</p>
            <p > {friendProfile.bio}</p>
                  </div>
                  </div>
                  </div>

                
                  <div className="user-profile-nav__menu2">
     <ul className="nav__list2">
       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          <h2 className='bar-text'>POSTS</h2>
          </NavLink>
       </li>

       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          <h2 className='bar-text'>PHOTOS</h2>
          </NavLink>
       </li>

       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          <h2 className='bar-text'>FRIENDS</h2>
          </NavLink>
       </li>

       <li className="nav__item2">
            <NavLink to="/home" className="nav__link2" >
            <h2 className='bar-text'></h2> 
          </NavLink>
       </li>
     </ul>
          </div>
            {/* Reuse ProfilePosts component to display friend's posts */}
            <ProfilePosts posts={friendProfile.posts} profile={friendProfile} />
          </div>
        ) : (
          <div>
            <p className='button-primary'>Loading profile...</p>
          </div>
        )}
      </div>
        
    </>

  );
};

export default FriendProfile;
