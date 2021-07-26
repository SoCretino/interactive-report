import React from 'react';
import { connect } from 'react-redux';
import { setUser } from '../../../actions';
import Dropdown from 'react-dropdown';

import 'react-dropdown/style.css';

export const UserDropdownComponent = (props) => (
  <Dropdown
    options={props.users}
    value={props.user.value}
    placeholder={'All Users'}
    onChange={props.setUser}
  />
)

const mapStateToProps = (state) => ({
  user: state.setUser.user,
  users: state.setUsers.users,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user))
});

export const UserDropdown = connect(mapStateToProps, mapDispatchToProps)(UserDropdownComponent);