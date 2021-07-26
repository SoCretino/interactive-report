import React, { Component } from 'react';
import { connect } from 'react-redux';

import { chartColors } from '../../ChartSettings';
import Donut from '../charts/Donut';
// import AreaStacked from '../charts/AreaStacked';

class Projects extends Component {
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

    const webProjects = filteredTimers.filter(item => ['web'].includes(item.Type));
    let getProjectNames = [...new Set(webProjects.map(item => item.Project))];

    const DMProjects = filteredTimers.filter(item => ['dm'].includes(item.Type));
    let getDMProjectNames = [...new Set(DMProjects.map(item => item.Project))];

    let peopleInvolved = [...new Set(webProjects.map(item => item.User))];

    const getStages = ['Prep', 'Build', 'Screens', 'ISV', 'QA', 'Release'];
    var durationPerStep = new Array(getStages.length).fill(0);

    //Hours allocated per step
    for (var i = 0; i < getStages.length; i++) {
      for (var z = 0; z < filteredTimers.length; z++) {
        if (getStages[i] === filteredTimers[z].Stage) {
          durationPerStep[i] += filteredTimers[z].Duration;
        }
      }
      durationPerStep[i] = Math.round(durationPerStep[i]);
    }

    const donutDurationPerStep = {
      chartTitle: 'Hours allocated per step',
      chartSubtitle: ' ',
      chartSeries: durationPerStep,
      chartLabels: getStages,
      color:chartColors.stages
    }

    //Hours allocated per role
    const getRoles = ['Project Leader', 'PM', 'PD', 'Dev Sr', 'Dev Jr'];
    var durationPerRole = new Array(getRoles.length).fill(0);

    for (i = 0; i < getRoles.length; i++) {
      for (z = 0; z < filteredTimers.length; z++) {
        if (getRoles[i] === filteredTimers[z].Role && filteredTimers[z].Type !== 'hold') {
          durationPerRole[i] += filteredTimers[z].Duration;
        }
      }
      durationPerRole[i] = Math.round(durationPerRole[i]);
    }

    const donutDurationPerRole = {
      chartTitle: 'Hours allocated per role',
      chartSubtitle: ' ',
      chartSeries: durationPerRole,
      chartLabels: getRoles,
      color:chartColors.role
    }

    return (
      //The key attribute on charts is being used to properly update them when date changes.
      <div className = "Projects">
        <div className = "total-container">
          <div className = "count">
            <div>Web Projects</div>
            <div>{getProjectNames.length}</div>
          </div>
          <div className = "count">
            <div>DM Projects</div>
            <div>{getDMProjectNames.length}</div>
          </div>
          <div className = "count">
            <div>People Involved</div>
            <div>{peopleInvolved.length}</div>
          </div>
        </div>
        <div className = "donut-2-container">
          <Donut className = "row-2-donut" colorD={donutDurationPerStep.color} chartTitle = {donutDurationPerStep.chartTitle} chartSubtitle = {donutDurationPerStep.chartSubtitle} chartSeries = {donutDurationPerStep.chartSeries} chartLabels = {donutDurationPerStep.chartLabels} key = {donutDurationPerStep.chartSeries}/>
          <Donut className = "row-2-donut" colorD={donutDurationPerRole.color} chartTitle = {donutDurationPerRole.chartTitle} chartSubtitle = {donutDurationPerRole.chartSubtitle} chartSeries = {donutDurationPerRole.chartSeries} chartLabels = {donutDurationPerRole.chartLabels} key = {donutDurationPerRole.chartSeries}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  startDate: state.setDate.startDate,
  endDate: state.setDate.endDate,
  dataTimers: state.getDataTimers,
  workshop: state.toggleWorkshop.workshop
})

export default connect(mapStateToProps)(Projects);