import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/create-post.css";
import Navbar from './Navbar';
import Menu from './Menu';
import { backendUrl } from '../App';

const CreatePost = ({ addNewPost }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

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
    formData.append('caption', caption);
    navigate("/profile")

    try {
      const res = await axios.post(backendUrl + '/api/posts', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      addNewPost(res.data);
      setImage(null);
      setCaption('');
      navigate('/profile');

    } catch (err) {
      console.error('Error creating post:', err.response ? err.response.data : err.message);
    }
  };


  return (
    <div className='home1'>
      <Navbar />
      <Menu />
      <div className='create'>
      <div className='create-post'>
        <h2 className='create-post-header'>create a post</h2>
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

export default CreatePost;
