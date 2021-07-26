import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { setUsers } from '../../../actions';
import { setUser } from '../../../actions';

import { DateRange } from './DateRange';
import { ToggleWorkshop } from './ToggleWorkshop';
import { RoleDropdown } from './Role';
import { UserDropdown } from './User';


class Filters extends Component {
  render() {
    var dateStart = new Date(this.props.startDate);
    var dateEnd = new Date(this.props.endDate);
    var isWorkshopEnabled = this.props.workshop;
    var filteredTimers = this.props.dataTimers.filter(function(a) {
      var dateCompare = new Date (a.Date);
      if (isWorkshopEnabled === false)
        return ((dateCompare >= dateStart && dateCompare <= dateEnd));
      else
        return ((dateCompare >= dateStart && dateCompare <= dateEnd) && a.Workshop === true);
    });

    let allUsers = ['All Users'].concat([...new Set(filteredTimers.map(item => item.User).sort())]);
    this.props.setUsers(allUsers);

    if (this.props.roles.value !== undefined) {
      var timersByRoles = filteredTimers.filter(item => item.Role === this.props.roles.value);
      let usersByRole = ['All Users'].concat([...new Set(timersByRoles.map(item => item.User).sort())]);
      this.props.setUsers(usersByRole);
      this.props.setUser('All Users');
    }

    if (this.props.roles.value === 'All Roles') {
      this.props.setUsers(allUsers);
    }

    return (
      <div className = "header-filters">
        <DateRange></DateRange>
        <span className="workshop-label">Workshop</span><ToggleWorkshop></ToggleWorkshop>
        {this.props.location.pathname === '/team' || this.props.location.pathname === '/' ? <RoleDropdown></RoleDropdown> : null}
        {this.props.location.pathname === '/team' || this.props.location.pathname === '/' ? <UserDropdown></UserDropdown> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataTimers: state.getDataTimers,
  startDate: state.setDate.startDate,
  endDate: state.setDate.endDate,
  workshop: state.toggleWorkshop.workshop,
  roles: state.setRoles.roles
});

const mapDispatchToProps = (dispatch) => ({
  setUsers: (users) => dispatch(setUsers(users)),
  setUser: (user) => dispatch(setUser(user))
});

export default compose (withRouter, connect(mapStateToProps, mapDispatchToProps))(Filters);