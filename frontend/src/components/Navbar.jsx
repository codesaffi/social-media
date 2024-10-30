import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../styles/home.css";
import { backendUrl } from "../App";

const Navbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // State to hold unread notifications count

    const handleSearchIconClick = () => {
        setShowSearch(!showSearch);
    };

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(backendUrl + '/api/notifications/unread-count', {
                    headers: { 'x-auth-token': token }
                });
                setUnreadCount(res.data.unreadCount);
            } catch (err) {
                console.error('Error fetching unread notifications count:', err.response ? err.response.data : err.message);
            }
        };

        fetchUnreadCount();
    }, []); // Fetch unread count on component mount

    return (
        <nav className="navbar">
            <div className={`left-side ${showSearch ? "hide" : ""}`}>
                <NavLink className="logo" to="/home">
                    <h2>logo</h2>
                </NavLink>
            </div>

            <div className="right-side">
                <div className={`div search-bar1 ${showSearch ? "show" : ""}`}>
                    <input className="search" type="text" name="search" placeholder="Search..." />
                    <FontAwesomeIcon
                        className={`searchbar-icon ${showSearch ? "show" : ""}`}
                        icon={faMagnifyingGlass}
                        onClick={handleSearchIconClick}
                    />
                </div>

                <div className={`div icon1 ${showSearch ? "hide" : ""}`}>
                    <NavLink to="/messages">
                        <FontAwesomeIcon className="my-icons" icon={faMessage} />
                    </NavLink>

                    <NavLink to="/notifications">
                        <div className="bell-container">
                            <FontAwesomeIcon className="my-icons" icon={faBell} />
                            {unreadCount > 0 && (
                                <span className="notification-count">{unreadCount}</span>
                            )}
                        </div>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
