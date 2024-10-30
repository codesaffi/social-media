import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'
import { backendUrl } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + '/api/users/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        navigate('/home');
      }
    } catch (err) {
      alert('Invalid credentials. Please try again or sign up.');
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (

   <div className='rp-design'>
    <div className="form-container App">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="signup-link">
        Not registered? <span onClick={handleSignupRedirect}>Sign Up</span>
      </p>
    </div>
    </div>
    
  );
};

export default Login;