import React from "react";
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse, faUser, faUserGroup, faGear } from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css";

const Menu = () => {
  return (
    <div className="nav__menu">
    <ul className="nav__list">
      <li className="nav__item">
      <NavLink to="/home" className="nav__link" >
        <FontAwesomeIcon className="my-icons" icon={faHouse} />
      </NavLink>
      </li>

      <li className="nav__item">
      <NavLink to="/profile" className="nav__link" >
        <FontAwesomeIcon className="my-icons" icon={faUser} />
      </NavLink>
      </li>

      <li className="nav__item">
      <NavLink to="/friends" className="nav__link" >
        <FontAwesomeIcon className="my-icons" icon={faUserGroup} />
      </NavLink>
      </li>

      <li className="nav__item">
      <NavLink to="/settings" className="nav__link" >
        <FontAwesomeIcon className="my-icons" icon={faGear} />
      </NavLink>
      </li>
    </ul>
    </div>
  )
}

export default Menu