import React, { Component } from 'react';
import { connect } from 'react-redux';
import Collapsible from 'react-collapsible';
import isAfter from 'date-fns/isAfter';
import { chartColors } from '../../ChartSettings';

import StackedHorizontalBar from '../charts/StackedHorizontalBar';

class Team extends Component {
  render () {
    //This has to go to getDataTimers.js someday.
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

    filteredTimers = filteredTimers.filter(item => ![''].includes(item.Role));  //Removes empty roles.

    var roles = this.props.roles.value;
    if (roles === undefined) {
      roles = 'All Roles';
    }
    if (roles !== 'All Roles')
      filteredTimers = filteredTimers.filter(item => roles.includes(item.Role));  //Filter by role type.

    var user = this.props.user.value;
    if (user === undefined) {
      user = 'All Users';
    }
    if (user !== 'All Users')
      filteredTimers = filteredTimers.filter(item => user.includes(item.User));  //Filter by user.

    //Sort by date, ascending.
    filteredTimers = filteredTimers.sort(function(a,b){return new Date(a.Date) - new Date(b.Date)});

    //Total of days worked
    var daysWorked = 0;
    var dayAlreadyWorked = dateStart;

    for (var i = 0; i < filteredTimers.length; i++) {
      if ((isAfter(new Date(filteredTimers[i].Date), dayAlreadyWorked) || dayAlreadyWorked === dateStart) && (filteredTimers[i].Type === 'web' || filteredTimers[i].Type === 'dm' || filteredTimers[i].Type === 'Admin') && filteredTimers[i].Extra === false && filteredTimers[i].Duration >= 0.035) {
        daysWorked++;
        dayAlreadyWorked = new Date(filteredTimers[i].Date);
      }
    }

    //Overtime hours
    var totalOTHours = 0;

    for (i = 0; i < filteredTimers.length; i++)
      if (filteredTimers[i].Extra === true && filteredTimers[i].Duration >= 0.035 && (filteredTimers[i].Type === 'web' || filteredTimers[i].Type === 'dm'))
        totalOTHours += filteredTimers[i].Duration;

    totalOTHours = totalOTHours.toFixed(0);

    //Total of overtime days worked
    var daysOTWorked = 0;
    var dayOTAlreadyWorked = dateStart;

    for (i = 0; i < filteredTimers.length; i++) {
      if ((isAfter(new Date(filteredTimers[i].Date), dayOTAlreadyWorked) || dayOTAlreadyWorked === dateStart) && (filteredTimers[i].Type === 'web' || filteredTimers[i].Type === 'dm') && filteredTimers[i].Extra === true && filteredTimers[i].Duration >= 0.035) {
        daysOTWorked++;
        dayOTAlreadyWorked = new Date(filteredTimers[i].Date);
      }
    }

    //Team status per person
    let getUsers = [...new Set(filteredTimers.map(item => item.User))];

    var userActiveInactive = {};

    userActiveInactive[0] = {
      Type: 'Active',
      DurationPerUser: new Array (getUsers.length).fill(0)
    }

    userActiveInactive[1] = {
      Type: 'On hold',
      DurationPerUser: new Array (getUsers.length).fill(0)
    }

    for (i = 0; i < filteredTimers.length; i++) {
      for (var z = 0; z < getUsers.length; z++) {
        if (getUsers[z] === filteredTimers[i].User) {
          if (filteredTimers[i].Type !== 'hold')
            userActiveInactive[0].DurationPerUser[z] += Math.round(filteredTimers[i].Duration);
          else
            userActiveInactive[1].DurationPerUser[z] += Math.round(filteredTimers[i].Duration);
        }
      }
    }

    //Sort descending
    var totalHoursActiveInactivePerUser = [];

    for (i = 0; i < getUsers.length; i++) {
      totalHoursActiveInactivePerUser[i] = [getUsers[i], userActiveInactive[0].DurationPerUser[i]];
    }

    totalHoursActiveInactivePerUser.sort(function(a,b) {return b[1]-a[1]});

    for (i = 0; i < getUsers.length; i++) {
      getUsers[i] = totalHoursActiveInactivePerUser[i][0]
    }

    userActiveInactive[0].DurationPerUser = new Array (getUsers.length).fill(0);
    userActiveInactive[1].DurationPerUser = new Array (getUsers.length).fill(0);

    for (i = 0; i < filteredTimers.length; i++) {
      for (z = 0; z < getUsers.length; z++) {
        if (getUsers[z] === filteredTimers[i].User) {
          if (filteredTimers[i].Type !== 'hold')
            userActiveInactive[0].DurationPerUser[z] += Math.round(filteredTimers[i].Duration);
          else
            userActiveInactive[1].DurationPerUser[z] += Math.round(filteredTimers[i].Duration);
        }
      }
    }

    const stackedStatusPerPerson = {
      chartTitle: 'Team status per person',
      chartSubtitle: ' ',
      chartSeries: userActiveInactive,
      chartCategories: getUsers,
      chartShowLabels: false,
      chartStackType: 'normal',
      chartPercentage: false,
      colorChart:chartColors.activeHold

    }

    //Project allocation by resource type
    // let getRoleNames = [...new Set(filteredTimers.map(item => item.Role))];
    // getRoleNames = getRoleNames.filter(role => role !== '');  //Sometimes the role comes empty.
    const getRoleNames = ['Project Leader', 'PM', 'Dev Sr', 'Dev Jr', 'PD'];  //I'm not really sure what will happen if none get filled. I guess nothing since the duration is filled with zeroes.
    const getType = ['web', 'dm', 'Admin'];

    var percentageByRole = {};

    for (i = 0; i < getType.length; i++) {
      percentageByRole[i] = {
        Type: getType[i],
        Duration: new Array (getRoleNames.length).fill(0)
      }
    }

    for (i = 0; i < filteredTimers.length; i++) {
      for (z = 0; z < getRoleNames.length; z++) {
        if (filteredTimers[i].Role === getRoleNames[z]) {
          for (var x = 0; x < getType.length; x++) {
            if (percentageByRole[x].Type === filteredTimers[i].Type)
              percentageByRole[x].Duration[z] += Math.ceil(filteredTimers[i].Duration);
          }
        }
      }
    }

/*
    const stackedPercentageByRole = {
    chartTitle: 'Project allocation per role',
    chartSubtitle: ' ',
    chartSeries: percentageByRole,
    chartCategories: getRoleNames,
    chartShowLabels: true,
    chartStackType: '100%',
    chartPercentage: true
    }
*/

    //Project allocation per person
    var percentageByPersons = {};

    for (i = 0; i < getType.length; i++) {
      percentageByPersons[i] = {
        Type: getType[i],
        Duration: new Array (getUsers.length).fill(0)
      }
    }

    for (i = 0; i < filteredTimers.length; i++) {
      for (z = 0; z < getUsers.length; z++) {
        if (filteredTimers[i].User === getUsers[z]) {
          for (x = 0; x < getType.length; x++) {
            if (percentageByRole[x].Type === filteredTimers[i].Type)
              percentageByPersons[x].Duration[z] += Math.ceil(filteredTimers[i].Duration);
          }
        }
      }
    }

    percentageByPersons[0].Type = 'Web';
    percentageByPersons[1].Type = 'DM';
    percentageByPersons[2].Type = 'Admin/Tools';

    const stackedPercentageByPersons = {
      chartTitle: 'Project allocation per person',
      chartSubtitle: ' ',
      chartSeries: percentageByPersons,
      chartCategories: getUsers,
      chartShowLabels: true,
      chartStackType: '100%',
      chartPercentage: true,
      colorChart: chartColors.webDmAdmin

    }

    //Projects worked per person
    /*I am not proud of how I've made this*/
    var projectsWorkedByPerson = {};

    const webProjects = filteredTimers.filter(item => ['web'].includes(item.Type));  //This can be further optimized with only getting the names and not making a deep-copy.
    let getProjectNames = [...new Set(webProjects.map(item => item.Project))];

    const DMProjects = filteredTimers.filter(item => ['dm'].includes(item.Type));
    let getDMProjectNames = [...new Set(DMProjects.map(item => item.Project))];

    for (i = 0; i < getUsers.length; i++) {
      projectsWorkedByPerson[i] = {
        User: getUsers[i],
        Web: getProjectNames,
        DurationWeb: new Array (getProjectNames.length).fill(0),
        Dm: getDMProjectNames,
        DurationDm: new Array (getDMProjectNames.length).fill(0),
        SumWebDM: 0
      }
    }

    for (i = 0; i < getUsers.length; i++) {
      for (z = 0; z < filteredTimers.length; z++) {
        if (filteredTimers[z].Type === 'web' && filteredTimers[z].User === getUsers[i]) {
          for (x = 0; x < getProjectNames.length; x++) {
            if (filteredTimers[z].Project === getProjectNames[x])
              projectsWorkedByPerson[i].DurationWeb[x] += filteredTimers[z].Duration;
          }
        }
        else if (filteredTimers[z].Type === 'dm' && filteredTimers[z].User === getUsers[i]) {
          for (x = 0; x < getDMProjectNames.length; x++) {
            if (filteredTimers[z].Project === getDMProjectNames[x])
              projectsWorkedByPerson[i].DurationDm[x] += filteredTimers[z].Duration;
          }
        }
      }
      var auxSortWeb = [];
      for (x = 0; x < getProjectNames.length; x++) {
        auxSortWeb[x] = [getProjectNames[x], projectsWorkedByPerson[i].DurationWeb[x]];
      }

      auxSortWeb.sort(function(a,b) {return b[1]-a[1]});

      for (x = 0; x < getProjectNames.length; x++) {
        projectsWorkedByPerson[i].Web[x] = auxSortWeb[x][0];
        projectsWorkedByPerson[i].DurationWeb[x] = auxSortWeb[x][1];
      }

      var auxSortDM = [];
      for (x = 0; x < getDMProjectNames.length; x++) {
        auxSortDM[x] = [getDMProjectNames[x], projectsWorkedByPerson[i].DurationDm[x]];
      }

      auxSortDM.sort(function(a,b) {return b[1]-a[1]});

      for (x = 0; x < getDMProjectNames.length; x++) {
        projectsWorkedByPerson[i].Dm[x] = auxSortDM[x][0];
        projectsWorkedByPerson[i].DurationDm[x] = auxSortDM[x][1];
      }
    }

    var listAux = [];
    var projectCounter = 0;
    const list = [];

    for (i = 0; i < getUsers.length; i++) {
      listAux = [];
      projectCounter = 0;

      projectsWorkedByPerson[i].SumWebDM = (projectsWorkedByPerson[i].DurationWeb.reduce((a,b) => a + b, 0) + projectsWorkedByPerson[i].DurationDm.reduce((a,b) => a + b, 0));

      // var auxSortSumWebDM = [];

      // for (i = 0; i < getUsers.length; i++) {
      //   auxSortSumWebDM[i] = [i, projectsWorkedByPerson[i].SumWebDM];
      // }

      // auxSortSumWebDM.sort(function(a,b) {return b[1]-a[1]});

      // console.log(auxSortSumWebDM);

      for (z = 0; z < getProjectNames.length; z++) {
        if (projectsWorkedByPerson[i].DurationWeb[z] !== 0) {
          listAux.push(<li className="user-projects-per-user" key = {projectsWorkedByPerson[i].SumWebDM + projectCounter}><span className="user-name">{projectsWorkedByPerson[i].Web[z]}</span><span className="user-projects">{'Web'}</span><span className="user-hours">{Math.round(projectsWorkedByPerson[i].DurationWeb[z]) !== 0 ? (Math.round(projectsWorkedByPerson[i].DurationWeb[z]) + 'h') : (1 + 'h')}</span></li>);
          projectCounter++;
        }
      }

      for (z = 0; z < getDMProjectNames.length; z++) {
        if (projectsWorkedByPerson[i].DurationDm[z] !== 0) {
          listAux.push(<li className="user-projects-per-user" key = {projectsWorkedByPerson[i].DurationDm[z]}><span className="user-name">{projectsWorkedByPerson[i].Dm[z]}</span><span className="user-projects">{'DM'}</span><span className="user-hours">{Math.round(projectsWorkedByPerson[i].DurationDm[z]) !== 0 ? (Math.round(projectsWorkedByPerson[i].DurationDm[z]) + 'h') : (1 + 'h')}</span></li>);
          projectCounter++;
        }
      }

      if (projectCounter !== 0) {
        list.push(<Collapsible key = {projectsWorkedByPerson[i].User} classParentString = "user-list-overall" triggerTagName = "span" trigger=<span className="user-list"><span className="user-name">{projectsWorkedByPerson[i].User}</span><span className="user-projects">{projectCounter + ' projects'}</span><span className="user-hours">{Math.round(projectsWorkedByPerson[i].SumWebDM) + 'h'}</span></span>><ul className = "user-list-projects">{listAux}</ul></Collapsible>); //Most likely we'll have to re-order by total hours per user.
      }
    }

    return (
      //The key attribute on charts is being used to properly update them when date changes.
      <div className = "Team">
        <div className = "total-container">
          <div className = "count">
            <div>Days Worked</div>
            <div>{daysWorked}</div>
          </div>
          <div className = "count">
            <div>Overtime Days</div>
            <div>{daysOTWorked}</div>
          </div>
          <div className = "count">
            <div>Overtime Hours</div>
            <div>{totalOTHours}</div>
          </div>
        </div>
        <div className = "chart-container">
          <StackedHorizontalBar className = "row-bar" colorchartH={stackedStatusPerPerson.colorChart} chartTitle = {stackedStatusPerPerson.chartTitle} chartSubtitle = {stackedStatusPerPerson.chartSubtitle} chartSeries = {stackedStatusPerPerson.chartSeries} chartCategories = {stackedStatusPerPerson.chartCategories} chartShowLabels = {stackedStatusPerPerson.chartShowLabels} chartStackType = {stackedStatusPerPerson.chartStackType} chartPercentage = {stackedStatusPerPerson.chartPercentage} key = {stackedStatusPerPerson.chartCategories}/>
          <div className = "list-projects"><h1>Projects worked per person</h1> {list} </div>
          {/*<StackedHorizontalBar chartTitle = {stackedPercentageByRole.chartTitle} chartSubtitle = {stackedPercentageByRole.chartSubtitle} chartSeries = {stackedPercentageByRole.chartSeries} chartCategories = {stackedPercentageByRole.chartCategories} chartShowLabels = {stackedPercentageByRole.chartShowLabels} chartStackType = {stackedPercentageByRole.chartStackType} chartPercentage = {stackedPercentageByRole.chartPercentage} key = {stackedPercentageByRole.chartCategories}/>*/}
          <StackedHorizontalBar className = "row-bar" colorchartH={stackedPercentageByPersons.colorChart} chartTitle = {stackedPercentageByPersons.chartTitle} chartSubtitle = {stackedPercentageByPersons.chartSubtitle} chartSeries = {stackedPercentageByPersons.chartSeries} chartCategories = {stackedPercentageByPersons.chartCategories} chartShowLabels = {stackedPercentageByPersons.chartShowLabels} chartStackType = {stackedPercentageByPersons.chartStackType} chartPercentage = {stackedPercentageByPersons.chartPercentage} key = {daysWorked}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  startDate: state.setDate.startDate,
  endDate: state.setDate.endDate,
  dataTimers: state.getDataTimers,
  workshop: state.toggleWorkshop.workshop,
  roles: state.setRoles.roles,
  user: state.setUser.user
});

export default connect(mapStateToProps)(Team);