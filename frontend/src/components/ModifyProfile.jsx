import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Profile.css";
import Navbar from './Navbar';
import Menu from './Menu';
import { backendUrl } from '../App';



const ModifyProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    phoneNumber: '',
    nickname: '',
    sex: '',
    bio: '',
    profilePicture: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(backendUrl +'/api/profile', {
          headers: { 'x-auth-token': token }
        });

        if (res.data.dob) {
          res.data.dob = new Date(res.data.dob).toISOString().split('T')[0];
        }

        setFormData({
          username: res.data.username,
          dob: res.data.dob,
          phoneNumber: res.data.phoneNumber,
          nickname: res.data.nickname,
          sex: res.data.sex,
          bio: res.data.bio,
          profilePicture: null
        });
      } catch (err) {
        console.error('Error fetching profile:', err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('profilePicture', formData.profilePicture);
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
<>
      <Navbar />
      <Menu />
      <div className="page">

      <div className="main create-profile">
        <div className='modify-pf-container'>
      <h2>Modify Your Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input className='profile-input' type="file" name="profilePicture" onChange={handleFileChange} />
          <input className='profile-input' type="file" name="coverPicture" onChange={handleFileChange}  />  {/* Cover Picture */}
          <input className='profile-input' type="text" name="username" value={formData.username} placeholder="Username" onChange={handleChange} required />
          <input className='profile-input' type="date" name="dob" value={formData.dob} placeholder="Date of Birth" onChange={handleChange} required />
          <input className='profile-input' type="text" name="phoneNumber" value={formData.phoneNumber} placeholder="Phone Number" onChange={handleChange} required />
          <input className='profile-input' type="text" name="nickname" value={formData.nickname} placeholder="Nickname" onChange={handleChange} required />
          <select className='profile-input' name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea className='profile-input' name="bio" value={formData.bio} placeholder="Bio" onChange={handleChange} required></textarea>
          <button className='profile-button' type="submit">Save Changes</button>
        </form>
        </div>
      </div>
      </div>
      </>
  );
};

export default ModifyProfile;
