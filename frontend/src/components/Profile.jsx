import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import ProfilePosts from './ProfilePosts'; 
import "../styles/Profile.css";
import Navbar from './Navbar';
import Menu from './Menu';
import { backendUrl } from '../App';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const res = await axios.get(backendUrl + '/api/profile', {
          headers: { 'x-auth-token': token }
        });
        
        if (res.data.dob) {
          res.data.dob = new Date(res.data.dob).toISOString().split('T')[0];
        }

        setProfile(res.data);
        setLoading(false); // Set loading to false after fetching the profile

        // Fetch posts as well
        const postsRes = await axios.get(backendUrl + '/api/posts', {
          headers: { 'x-auth-token': token }
        });
        setPosts(postsRes.data);

      } catch (err) {
        console.error('Error fetching profile:', err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
        setLoading(false); // Set loading to false if there is an error
      }
    };
    fetchProfile();
  }, [navigate]);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loader/spinner if you prefer
  }

  return (
    <>
      <Navbar />
      <Menu />

      <div className='test'>
        {profile ? (
          <>
            <div className='profile-container'>
              {profile.coverPicture && (
                <img
                  className='cover-picture'
                  src={`${backendUrl}/${profile.coverPicture}`}
                  alt="Cover"
                />
              )}
              {profile.profilePicture && (
                <img
                  className='profile-picture'
                  src={`${backendUrl}/${profile.profilePicture}`}
                  alt="Profile"
                />
              )}
              <p className='profile-username'>{profile.username}</p>
              <p className='profile-info'>{profile.friends.length} friends</p>
              <p className='profile-info'>Date of Birth: {profile.dob}</p>
              <p className='profile-info'>Phone Number: {profile.phoneNumber}</p>
              <p className='profile-info'>Nickname: {profile.nickname}</p>
              <p className='profile-info'>Sex: {profile.sex}</p>
              <p className='profile-bio profile-info'>Bio: {profile.bio}</p>
              <div className='btn'>
                <button className='button-pf'>
                  <NavLink className="link" to="/create-post">
                    create a post
                  </NavLink>
                </button>
                <button className='button-pf'>
                  <NavLink className="link" to="/modify-profile">
                    modify profile
                  </NavLink>
                </button>
              </div>
            </div>

            <div className="nav__menu2">
              <ul className="nav__list2">
                <li className="nav__item2">
                  <NavLink to="/home" className="nav__link2">
                    <h2 className='bar-text'>POSTS</h2>
                  </NavLink>
                </li>
                <li className="nav__item2">
                  <NavLink to="/home" className="nav__link2">
                    <h2 className='bar-text'>PHOTOS</h2>
                  </NavLink>
                </li>
                <li className="nav__item2">
                  <NavLink to="/home" className="nav__link2">
                    <h2 className='bar-text'>FRIENDS</h2>
                  </NavLink>
                </li>
                <li className="nav__item2">
                  <NavLink to="/home" className="nav__link2">
                    <h2 className='bar-text'></h2>
                  </NavLink>
                </li>
              </ul>
            </div>

            <ProfilePosts posts={posts} profile={profile} addNewPost={addNewPost} />
          </>
        ) : (
          <div className='rp-design-3'>
            <button className='button-primary'>
              <NavLink className="link" to="/create-profile">
                You did not create your profile. Create
              </NavLink>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
