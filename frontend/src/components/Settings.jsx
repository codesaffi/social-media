import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/settings.css";
import Navbar from "./Navbar";
import Menu from "./Menu";

const Settings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the user's token from local storage or any other storage you're using
        localStorage.removeItem('token'); // Assuming you're storing the JWT token in localStorage

        // Redirect the user to the login page
        navigate('/login');
    };

  return (


    <>
          <Navbar />
          <Menu />
          <div className='page'>
            <div className='settings'>
                <div className='settings-box'>                                               
                   <div className='settings-header'>
                    settings & privacy
                    </div>
                    <div className='settings-content'> 
                        <ul className='profile-settings'>
                        <li className='profile-settings-list-header'>
                              profile settings
                            </li>
                            <li className='profile-settings-list'>
                                modify profile
                            </li>
                        </ul>
                        <ul className='profile-settings'>
                        <li className='profile-settings-list-header'>
                              privacy settings
                            </li>
                            <li className='profile-settings-list'>
                                configure privacy
                            </li>
                        </ul>
                        <ul className='profile-settings'> 
                        <li className='profile-settings-list-header'>
                        preference settings
                            </li>
                            <li className='profile-settings-list'>
                                dark mode
                            </li>
                        </ul>
                       <button className='settings-button' onClick={handleLogout}>
                         Logout
                       </button>

                    </div>
                </div>
            </div>
          </div>
    </>

  )
}

export default Settings