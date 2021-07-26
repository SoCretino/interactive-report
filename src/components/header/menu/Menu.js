import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Menu extends Component {
  render () {
    return (
      <div className = "header-menu">
          <ul>
            <li>
              <NavLink to='/team' activeClassName = "active-navlink">Team</NavLink>
            </li>
            <li>
              <NavLink to='/work' activeClassName = "active-navlink">Work</NavLink>
            </li>
            <li>
              <NavLink to='/projects' activeClassName = "active-navlink">Projects</NavLink>
            </li>
          </ul>
      </div>
    );
  }
}

export default Menu;