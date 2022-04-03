import React from "react";
import { Link, NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  return (
    <header className={classes.header}>
      <div className={classes.dropdown}>
        <button className={classes.dropbtn}>
          Guides <FontAwesomeIcon icon={faAngleDown} />
        </button>
        <div className={classes.dropdown_content}>
          <Link to="/computing-support-and-resistance-lines-in-javascript">Computing Support and Resistance Lines in Javascript</Link>
        </div>
      </div>
      <Link to="/" className={classes.logo}>
      Time Series Mathematics
      </Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink className={(navData) => navData.isActive ? classes.active : '' } to='/donate'>
             Donate
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
