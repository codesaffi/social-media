import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import "../styles/addfriend.css";

const FriendsSideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`friends-main ${isSidebarOpen ? "friends-main-slide" : ""}`}>
        <div className={`sidebar ${isSidebarOpen ? "sidebar-slide" : ""}`}>
          <div className={`friends-header ${isSidebarOpen ? "friends-header-slide" : ""}`}>
            <h1 className={`header-1 ${isSidebarOpen ? "header-1-slide" : ""}`}>friends</h1>
            <h1 className={`header-3 ${isSidebarOpen ? "header-2-slide" : ""}`} onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </h1>
          </div>

          <ul className="sidebar-ul">
            <NavLink to="/addfriends" className="nav__link no1">
              <li className={`sidebar-li ${isSidebarOpen ? "sidebar-li-slide" : ""}`}>
                <FontAwesomeIcon className={`friends-icon sidebar-icon ${isSidebarOpen ? "friends-icon-slide" : ""}`} icon={faUser} />
                <p className={`li-p ${isSidebarOpen ? "li-p-slide" : ""}`}>add friends</p>
              </li>
            </NavLink>
            <NavLink to="/friend-request" className="nav__link">
              <li className={`sidebar-li ${isSidebarOpen ? "sidebar-li-slide" : ""}`}>
                <FontAwesomeIcon className={`friends-icon sidebar-icon ${isSidebarOpen ? "friends-icon-slide" : ""}`} icon={faUser} />
                <p className={`li-p ${isSidebarOpen ? "li-p-slide" : ""}`}>friend request</p>
              </li>
            </NavLink>
            <NavLink to="/my-friends" className="nav__link">
              <li className={`sidebar-li ${isSidebarOpen ? "sidebar-li-slide" : ""}`}>
                <FontAwesomeIcon className={`friends-icon sidebar-icon ${isSidebarOpen ? "friends-icon-slide" : ""}`} icon={faUser} />
                <p className={`li-p ${isSidebarOpen ? "li-p-slide" : ""}`}>my friends</p>
              </li>
            </NavLink>
            <NavLink to="/birthdays" className="nav__link">
              <li className={`sidebar-li ${isSidebarOpen ? "sidebar-li-slide" : ""}`}>
                <FontAwesomeIcon className={`friends-icon sidebar-icon ${isSidebarOpen ? "friends-icon-slide" : ""}`} icon={faUser} />
                <p className={`li-p ${isSidebarOpen ? "li-p-slide" : ""}`}>birthdays</p>
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FriendsSideBar;
