import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/create-post.css";
import Navbar from './Navbar';
import Menu from './Menu';
import { backendUrl } from '../App';

const BirthdayPost = ({ addNewBirthdayPost }) => {
  const { friendUsername } = useParams(); // Getting friend's username from the URL
  const { friendId } = useParams();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [currentUsername, setCurrentUsername] = useState(''); // State to store current user's username
  const navigate = useNavigate();


 // Fetch current user's username when the component mounts
 useEffect(() => {
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get(backendUrl + '/api/auth/user', {
          headers: { 'x-auth-token': token }
        });
        setCurrentUsername(res.data.username); // Assuming the username is in res.data
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  fetchCurrentUser();
}, []); // Empty dependency array means it runs once on component mount



  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', `${currentUsername} is with ${friendUsername}! ${caption}`);

    try {
      const res = await axios.post(backendUrl + '/api/posts', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      addNewBirthdayPost(res.data); // Adding the new post to the state in App.js
      setImage(null);
      setCaption('');
      navigate('/profile');
    } catch (err) {
      console.error('Error creating birthday post:', err.response ? err.response.data : err.message);
    }
  };


  return (
    <div className='home1'>
      <Navbar />
      <Menu />
      <div className='create'>
        <div className='create-post'>
          <h2 className='create-post-header'>Post Birthday Card</h2>
          <form onSubmit={handleSubmit}>
            <input className='post-form' type="file" onChange={handleImageChange} required />
            <textarea className='post-form' placeholder="Write a caption..." value={caption} onChange={handleCaptionChange} required></textarea>
            <button className='create-post-button' type="submit">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BirthdayPost;
