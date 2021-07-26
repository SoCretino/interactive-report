import React from 'react';
import { connect } from 'react-redux';
import { setRoles } from '../../../actions';
import Dropdown from 'react-dropdown';

import 'react-dropdown/style.css';

const getRoleNames = ['All Roles', 'Project Leader', 'PM', 'Dev Sr', 'Dev Jr', 'PD'];

export const RoleDropdownComponent = (props) => (
  <Dropdown
    options={getRoleNames}
    value={props.roles.value}
    placeholder={getRoleNames[0]}
    onChange={props.setRoles}
  />
)

const mapStateToProps = (state) => ({
  roles: state.setRoles.roles
});

const mapDispatchToProps = (dispatch) => ({
  setRoles: (roles) => dispatch(setRoles(roles))
});

export const RoleDropdown = connect(mapStateToProps, mapDispatchToProps)(RoleDropdownComponent);