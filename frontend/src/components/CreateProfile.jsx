import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Profile.css";
import Navbar from './Navbar';
import Menu from './Menu';
import { backendUrl } from '../App';


const CreateProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    phoneNumber: '',
    nickname: '',
    sex: '',
    bio: '',
    profilePicture: null,
    coverPicture: null
  });

  const navigate = useNavigate();

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('profilePicture', formData.profilePicture);
    data.append('coverPicture', formData.coverPicture); // Add cover picture
    data.append('username', formData.username);
    data.append('dob', formData.dob);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('nickname', formData.nickname);
    data.append('sex', formData.sex);
    data.append('bio', formData.bio);

    try {
      await axios.post(backendUrl + '/api/profile', data, {
        headers: {
          'x-auth-token': token
        }
      });

      navigate('/profile');
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="home1">
      <Navbar />
      <div className="page">
        <Menu />
        <div className="main create-profile">
        <div className='modify-pf-container'>
          <h2>Create Your Profile</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input className='profile-input' type="file" name="profilePicture" onChange={handleFileChange} required />
            <input className='profile-input' type="file" name="coverPicture" onChange={handleFileChange} required />  {/* Cover Picture */}
            <input className='profile-input' type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input className='profile-input' type="date" name="dob" placeholder="Date of Birth" onChange={handleChange} required />
            <input className='profile-input' type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
            <input className='profile-input' type="text" name="nickname" placeholder="Nickname" onChange={handleChange} required />
            <select className='profile-input' name="sex" onChange={handleChange} required>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <textarea className='profile-input' name="bio" placeholder="Bio" onChange={handleChange} required></textarea>
            <button className='profile-button' type="submit">Save</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateProfile;