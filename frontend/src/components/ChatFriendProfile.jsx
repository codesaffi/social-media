import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import ProfilePosts from './ProfilePosts'; // Reuse the same ProfilePosts component
import "../styles/Profile.css";
import Navbar from "./Navbar";
import Menu from "./Menu";
import { backendUrl } from '../App';

const ChatFriendProfile = () => {
    const { id } = useParams(); // Get the friend's ID from the URL
    const [friendProfile, setFriendProfile] = useState(null);
  
    useEffect(() => {
      const fetchFriendProfile = async () => {
        try {
          const res = await axios.get(backendUrl + `/api/users/profile/${id}/posts`, {
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
<div className='my-profile-page'>

{friendProfile ? (
 <> 
<div className='profile-container'>
{friendProfile.coverPicture && (

<img 
src={`${backendUrl}/${friendProfile.coverPicture}`} 
alt="Cover" 
className='cover-picture' 
/>
)}
<img 
src={`${backendUrl}/${friendProfile.profilePicture}`} 
alt={friendProfile.username} 
className='profile-picture'
/>

  <p className='profile-username'> {friendProfile.username}</p>
 < p className='profile-info' > {formatDate(friendProfile.dob)}</p>
  <p className='profile-info' > {friendProfile.phoneNumber}</p>
  <p className='profile-info'> {friendProfile.nickname}</p>
  <p className='profile-info'> {friendProfile.sex}</p>
  <p className='profile-bio profile-info'> {friendProfile.bio}</p>
  </div>

      
        <div className="nav__menu2">
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
  {/* <ProfilePosts posts={posts} profile={profile} addNewPost={addNewPost} />  */}
</>
) : (
<div>
  <p className='button-primary'>Loading profile...</p>
</div>
)}

</div>

</>
  )
}

export default ChatFriendProfile
