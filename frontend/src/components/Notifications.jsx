import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/notifications.css';
import Navbar from "./Navbar";
import Menu from "./Menu";
import { backendUrl } from '../App';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(backendUrl + '/api/notifications', {
          headers: { 'x-auth-token': token }
        });
        setNotifications(res.data);
        setLoading(false);
        fetchUnreadCount(); // Update unread count when notifications are fetched
      } catch (err) {
        console.error('Error fetching notifications:', err.response ? err.response.data : err.message);
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(backendUrl + '/api/notifications/unread-count', {
          headers: { 'x-auth-token': token }
        });
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.error('Error fetching unread count:', err.response ? err.response.data : err.message);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${backendUrl}/api/notifications/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, readStatus: true } : notification
      ));
      fetchUnreadCount(); // Update unread count after marking notification as read
    } catch (err) {
      console.error('Error marking notification as read:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <>
      <Navbar unreadCount={unreadCount} />
      <Menu />
      <div className="notifications">
        <div className="notification-container">
          <h2 className='noti-header'>Notifications</h2>
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <ul className='noti-ul'>
              {notifications.map(notification => (
                <li 
                  key={notification._id} 
                  className={`noti-li ${notification.readStatus ? 'read' : 'unread'}`}
                >
                  {notification.message}
                  {!notification.readStatus && (
                    <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;

