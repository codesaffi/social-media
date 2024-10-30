import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPhone, faComment, faUsers, faCirclePlus, faGear } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import '../styles/messages.css'; // Create this file for styles
import Navbar from "./Navbar";
import Menu from "./Menu";
import { backendUrl } from '../App';

const MessagesPage = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch friends from the server
    axios.get(backendUrl + '/api/messages', { headers: { 'x-auth-token': localStorage.getItem('token') } })
      .then(response => {
        setFriends(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the friends!', error);
      });
  }, []);

  return (
    <>
    
          <Navbar />
          <Menu />

          <div className="nav__menu2">
     <ul className="message-nav__list2">
       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          {/* <h2 className='bar-text'>stories</h2> */}
          <FontAwesomeIcon className='message-icons' icon={faCirclePlus} />
          </NavLink>
       </li>

       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          {/* <h2 className='bar-text'>groups</h2> */}
          <FontAwesomeIcon className='message-icons' icon={faUsers} />
          </NavLink>
       </li>

       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          {/* <h2 className='bar-text'>chats</h2> */}
          <FontAwesomeIcon className='message-icons' icon={faComment} />
          </NavLink>
       </li>

       <li className="nav__item2">
          <NavLink to="/home" className="nav__link2" >
          {/* <h2 className='bar-text'>phone</h2> */}
          <FontAwesomeIcon className='message-icons' icon={faPhone} />
          </NavLink>
       </li>

       <li className="nav__item2">
            <NavLink to="/home" className="nav__link2" >
            {/* <h2 className='bar-text'>settings</h2>  */}
            <FontAwesomeIcon className='message-icons' icon={faGear} />
          </NavLink>
       </li>
     </ul>
          </div>
      <div className='message-main'>
      <div className="messages-page">
        {friends.length > 0 ? (
          friends.map(friend => (
            <div key={friend._id} className="friend-card"
            onClick={() => window.location.href = `/chat/${friend._id}`}>
              
              <img 
                src={`${backendUrl}/${friend.profilePicture}`} 
                alt={friend.username} 
                className="chats-profile-picture" 
              />
              <p className='message-username'>{friend.username}</p>
            </div>

          ))
        ) : (
          <p>You have no friends yet.</p>
        )}
      </div>
      </div>

    </>
  );
};

export default MessagesPage;
