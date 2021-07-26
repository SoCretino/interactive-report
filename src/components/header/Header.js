import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Menu from './menu/Menu';
import Filters from './filters/Filters';

import './Header.scss';
import logo from '../../assets/img/logo.png';

class Header extends Component {
  render () {
    return (
      <div className= "Header">
          <div className = "header-main">
            <Link to='/'><img src = {logo} alt = "Logo" width = "140" height = "70"/></Link>
          </div>
          <Menu></Menu>
          <Filters></Filters>
      </div>
    );
  }
}

export default Header;