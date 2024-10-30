import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import ProfilePosts from './ProfilePosts'; // Reuse the same ProfilePosts component
import '../styles/userprofile.css'; // Create this file for styling
import "../styles/Profile.css";
import Navbar from "./Navbar";
import Menu from "./Menu";
import FriendsSideBar from "./FriendsSideBar";
import { backendUrl } from '../App';

const UserProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/profile/${id}/posts`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setProfile(res.data); // Set the friend's profile data including posts
      } catch (err) {
        console.error('Error fetching friend profile:', err.response ? err.response.data : err.message);
      }
    };
    fetchFriendProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;
  console.log(profile);

return (
  <>
          <Navbar />
          <Menu />
          <div className="home3">
          <FriendsSideBar />
          <div className='show-user-profile'>
          <div className="user-profile-page">
      <div className='user-profile-container'> 
      <div className='user-pictures'>
      {profile.coverPicture && (
        
        <img 
          src={`${backendUrl}/${profile.coverPicture}`} 
          alt="Cover" 
          className="user-cover-picture" 
        />
      )}
      <img 
        src={`${backendUrl}/${profile.profilePicture}`} 
        alt={profile.username} 
        className="user-profile-picture" 
      />
      </div>
      <div className='user-data'>
      <h1 className='user-data-username'>{profile.username}</h1>
      <p>Email: {profile.email}</p>
      <p>Date of Birth: {new Date(profile.dob).toLocaleDateString()}</p>
      <p>Phone Number: {profile.phoneNumber}</p>
      <p>Nickname: {profile.nickname}</p>
      <p>Sex: {profile.sex}</p>
      <p>Bio: {profile.bio}</p>
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
    <ProfilePosts posts={profile.posts} profile={profile} />
    </div>
          </div>

  </>
);
};

export default UserProfilePage;

