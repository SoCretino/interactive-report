import React, { Component } from 'react';
import { connect } from 'react-redux';

import { chartColors } from '../../ChartSettings';
import Donut from '../charts/Donut';
import StackedHorizontalBar from '../charts/StackedHorizontalBar';
import GroupedHorizontalBar from '../charts/GroupedHorizontalBar';

class Work extends Component {
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

    //Donut Chart - Total hours - Active and inactive, a.k.a, hold
    var hoursActive, hoursInactive;
    hoursActive = hoursInactive = 0;

    for (var i = 0; i < filteredTimers.length; i++)
      filteredTimers[i].Project !== 'Hold' ? hoursActive += filteredTimers[i].Duration : hoursInactive += filteredTimers[i].Duration;

    const donutTotalHours = {
      chartTitle: 'Active vs Hold time',
      chartSubtitle: ' ',
      chartSeries: [Math.ceil(hoursActive), Math.ceil(hoursInactive)],
      chartLabels: ['Active', 'Hold'],
      color:chartColors.activeHold
    }

    //Donut Chart - Total hours per type
    const removeInactiveType = ['hold', 'OOO'];
    let typesOfProjects = [...new Set(filteredTimers.map(item => item.Type))];  //Get all types.

    typesOfProjects = typesOfProjects.filter(item => !removeInactiveType.includes(item));  //Remove the inactives types.

    var hoursPerProject = new Array (typesOfProjects.length).fill(0);

    for (var z = 0; z < typesOfProjects.length; z++) {
      for (i = 0; i < filteredTimers.length; i++) {
        if (filteredTimers[i].Type === typesOfProjects[z])
          hoursPerProject[z] += Math.ceil(filteredTimers[i].Duration);
      }
    }

    for (i = 0; i < typesOfProjects.length; i++) {
      if (typesOfProjects[i] === 'web')
        typesOfProjects[i] = 'Web';
      if (typesOfProjects[i] === 'dm')
        typesOfProjects[i] = 'DM';
      if (typesOfProjects[i] === 'Admin')
        typesOfProjects[i] = 'Admin/Tools';
    }

    const donutHoursPerProject = {
      chartTitle: 'Hours allocated per type',
      chartSubtitle: 'Entire team hours dedicated for each project',
      chartSeries: hoursPerProject,
      chartLabels: typesOfProjects,
      color:chartColors.webDmAdmin
    }

    //Donut Total Hours X-Work
    const getStages = ['Prep', 'Build', 'Screens', 'ISV', 'QA', 'Release'];
    var xWork = new Array (getStages.length).fill(0);

    for (i = 0; i < filteredTimers.length; i++) {
      if (filteredTimers[i].Project === 'X-Work') {
        for (z = 0; z < getStages.length; z++) {
          if (filteredTimers[i].Stage === getStages[z]) {
            xWork[z] += filteredTimers[i].Duration;
          }
        }
      }
    }

    for (i = 0; i < getStages.length; i++) {
      xWork[i] = Math.round(xWork[i]);
    }

    const donutTotalHoursXWork = {
      chartTitle: 'X-Work',
      chartSubtitle: ' ',
      chartSeries: xWork,
      chartLabels: getStages,
      color:chartColors.stages
    };

    //Stacked Horizontal Bar - Total hours per step, web type - NOT BEING USE FOR DISPLAY
    const webProjects = filteredTimers.filter(item => ['web'].includes(item.Type));
    let getProjectNames = [...new Set(webProjects.map(item => item.Project))];
    //Removing X-Work, since we have it on a separete donut chart.
    const quantityWebProjects = getProjectNames.length;
    // getProjectNames = getProjectNames.filter(function(item) {
    //   return item !== 'X-Work';
    // });

    //Sort descending
    var totalHoursPerProject = new Array (getProjectNames.length).fill(0);

    for (i = 0; i < webProjects.length; i++) {
      for (z = 0; z < getProjectNames.length; z++) {
        if (getProjectNames[z] === webProjects[i].Project) {
          totalHoursPerProject[z] += Math.ceil(webProjects[i].Duration);
        }
      }
    }

    var auxSort = [];
    for (i = 0; i < getProjectNames.length; i++) {
      auxSort[i] = [getProjectNames[i], totalHoursPerProject[i]];
    }

    auxSort.sort(function(a,b) {return b[1]-a[1]});

    for (i = 0; i < getProjectNames.length; i++) {
      getProjectNames[i] = auxSort[i][0];
    }

    var chartStackedBarData = {};

    for (i = 0; i < getStages.length; i++) {
      chartStackedBarData[i] = {
        Stage: getStages[i],
        DurationPerProject: new Array (getProjectNames.length).fill(0)
      }
    }

    //Guess I'm a fucktard for using i to z to x, right? lol
    for (i = 0; i < webProjects.length; i++) {
      for (z = 0; z < getProjectNames.length; z++) {
        if (webProjects[i].Project === getProjectNames[z]) {
          for (var x = 0; x < getStages.length; x++) {
            if (chartStackedBarData[x].Stage === webProjects[i].Stage)
              chartStackedBarData[x].DurationPerProject[z] += Math.ceil(webProjects[i].Duration);
          }
        }
      }
    }

    /*
      const stackedHoursPerWebProject = {
      chartTitle: 'Web Projects',
      chartSubtitle: 'All size projects',
      chartSeries: chartStackedBarData,
      chartCategories: getProjectNames,
      chartShowLabels: false,
      chartStackType: 'normal'
    }*/

    //100Hrs+
    var sumDuration = 0;
    var getProjects250HrsNames = [];
    var chart250Hrs = {};

    for (i = 0; i < getProjectNames.length; i++) {
      for (x = 0; x < getStages.length; x++) {
        sumDuration += chartStackedBarData[x].DurationPerProject[i];
      }
      if (sumDuration > 250) {
        getProjects250HrsNames.push(getProjectNames[i]);
      }
      sumDuration = 0;
    }

    for (i = 0; i < getStages.length; i++) {
      chart250Hrs[i] = {
        Stage: getStages[i],
        DurationPerProject: new Array (getProjects250HrsNames.length).fill(0)
      }
    }

    for (i = 0; i < webProjects.length; i++) {
      for (z = 0; z < getProjects250HrsNames.length; z++) {
        if (webProjects[i].Project === getProjects250HrsNames[z]) {
          for (x = 0; x < getStages.length; x++) {
            if (chart250Hrs[x].Stage === webProjects[i].Stage)
              chart250Hrs[x].DurationPerProject[z] += Math.ceil(webProjects[i].Duration);
          }
        }
      }
    }

    const stacked250HoursPerWebProject = {
      chartTitle: 'Large Web Projects',
      chartSubtitle: 'More than 250 hours',
      chartSeries: chart250Hrs,
      chartCategories: getProjects250HrsNames,
      chartShowLabels: false,
      chartStackType: 'normal',
      chartPercentage: false
    }

    //Between 100 and 250Hrs
    var getProjectsBetween100And250HrsNames = [];
    var chartBetween100And250Hrs = {};

    for (i = 0; i < getProjectNames.length; i++) {
      for (x = 0; x < getStages.length; x++) {
        sumDuration += chartStackedBarData[x].DurationPerProject[i];
      }
      if (sumDuration >= 100 && sumDuration < 250) {
        getProjectsBetween100And250HrsNames.push(getProjectNames[i]);
      }
      sumDuration = 0;
    }

    for (i = 0; i < getStages.length; i++) {
      chartBetween100And250Hrs[i] = {
        Stage: getStages[i],
        DurationPerProject: new Array (getProjectsBetween100And250HrsNames.length).fill(0)
      }
    }

    for (i = 0; i < webProjects.length; i++) {
      for (z = 0; z < getProjectsBetween100And250HrsNames.length; z++) {
        if (webProjects[i].Project === getProjectsBetween100And250HrsNames[z]) {
          for (x = 0; x < getStages.length; x++) {
            if (chartBetween100And250Hrs[x].Stage === webProjects[i].Stage)
              chartBetween100And250Hrs[x].DurationPerProject[z] += Math.ceil(webProjects[i].Duration);
          }
        }
      }
    }

    const stackedBetween100And250HrsPerWebProject = {
      chartTitle: 'Medium Large Web Projects',
      chartSubtitle: 'Between 100 and 250 hours',
      chartSeries: chartBetween100And250Hrs,
      chartCategories: getProjectsBetween100And250HrsNames,
      chartShowLabels: false,
      chartStackType: 'normal',
      chartPercentage: false
    }

    //Between 20 and 100Hrs
    var getProjectsBetween20And100HrsNames = [];
    var chartBetween20And100Hrs = {};

    for (i = 0; i < getProjectNames.length; i++) {
      for (x = 0; x < getStages.length; x++) {
        sumDuration += chartStackedBarData[x].DurationPerProject[i];
      }
      if (sumDuration >= 20 && sumDuration < 100) {
        getProjectsBetween20And100HrsNames.push(getProjectNames[i]);
      }
      sumDuration = 0;
    }

    for (i = 0; i < getStages.length; i++) {
      chartBetween20And100Hrs[i] = {
        Stage: getStages[i],
        DurationPerProject: new Array (getProjectsBetween20And100HrsNames.length).fill(0)
      }
    }

    for (i = 0; i < webProjects.length; i++) {
      for (z = 0; z < getProjectsBetween20And100HrsNames.length; z++) {
        if (webProjects[i].Project === getProjectsBetween20And100HrsNames[z]) {
          for (x = 0; x < getStages.length; x++) {
            if (chartBetween20And100Hrs[x].Stage === webProjects[i].Stage)
              chartBetween20And100Hrs[x].DurationPerProject[z] += Math.ceil(webProjects[i].Duration);
          }
        }
      }
    }

    const stackedBetween20And100HrsPerWebProject = {
      chartTitle: 'Medium Web Projects',
      chartSubtitle: 'Between 20 and 100 hours',
      chartSeries: chartBetween20And100Hrs,
      chartCategories: getProjectsBetween20And100HrsNames,
      chartShowLabels: false,
      chartStackType: 'normal',
      chartPercentage: false
    }

    //20Hrs-
    var getProjectsLess20HrsNames = [];
    var chartLess20Hrs = {};

    for (i = 0; i < getProjectNames.length; i++) {
      for (x = 0; x < getStages.length; x++) {
        sumDuration += chartStackedBarData[x].DurationPerProject[i];
      }
      if (sumDuration < 20) {
        getProjectsLess20HrsNames.push(getProjectNames[i]);
      }
      sumDuration = 0;
    }

    for (i = 0; i < getStages.length; i++) {
      chartLess20Hrs[i] = {
        Stage: getStages[i],
        DurationPerProject: new Array (getProjectsLess20HrsNames.length).fill(0)
      }
    }

    for (i = 0; i < webProjects.length; i++) {
      for (z = 0; z < getProjectsLess20HrsNames.length; z++) {
        if (webProjects[i].Project === getProjectsLess20HrsNames[z]) {
          for (x = 0; x < getStages.length; x++) {
            if (chartLess20Hrs[x].Stage === webProjects[i].Stage)
              chartLess20Hrs[x].DurationPerProject[z] += Math.ceil(webProjects[i].Duration);
          }
        }
      }
    }

    const stackedLess20HoursPerWebProject = {
      chartTitle: 'Small Web Projects',
      chartSubtitle: 'Less than 20 hours',
      chartSeries: chartLess20Hrs,
      chartCategories: getProjectsLess20HrsNames,
      chartShowLabels: false,
      chartStackType: 'normal',
      chartPercentage: false
    }

    //DM Projects
    const DMProjects = filteredTimers.filter(item => ['dm'].includes(item.Type));
    let getDMProjectNames = [...new Set(DMProjects.map(item => item.Project))];

    //Sort Descending
    var totalHoursPerDM = new Array (getDMProjectNames.length).fill(0);

    for (i = 0; i < DMProjects.length; i++) {
      for (z = 0; z < getDMProjectNames.length; z++) {
        if (getDMProjectNames[z] === DMProjects[i].Project) {
          totalHoursPerDM[z] += Math.ceil(DMProjects[i].Duration);
        }
      }
    }

    var auxSortDMs = [];
    for (i = 0; i < getDMProjectNames.length; i++) {
      auxSortDMs[i] = [getDMProjectNames[i], totalHoursPerDM[i]];
    }

    auxSortDMs.sort(function(a,b) {return b[1]-a[1]});

    for (i = 0; i < getDMProjectNames.length; i++) {
      getDMProjectNames[i] = auxSortDMs[i][0];
    }

    var chartDMStackedBarData = {};

    for (i = 0; i < getStages.length; i++) {
      chartDMStackedBarData[i] = {
        Stage: getStages[i],
        DurationPerProject: new Array (getDMProjectNames.length).fill(0)
      }
    }

    for (i = 0; i < DMProjects.length; i++) {
      for (z = 0; z < getDMProjectNames.length; z++) {
        if (DMProjects[i].Project === getDMProjectNames[z]) {
          for (x = 0; x < getStages.length; x++) {
            if (chartDMStackedBarData[x].Stage === webProjects[i].Stage)
              chartDMStackedBarData[x].DurationPerProject[z] += Math.ceil(DMProjects[i].Duration);
          }
        }
      }
    }

    const stackedHoursPerDMProject = {
      chartTitle: 'DM Projects',
      chartSubtitle: ' ',
      chartSeries: chartDMStackedBarData,
      chartCategories: getDMProjectNames,
      chartShowLabels: false,
      chartStackType: 'normal',
      chartPercentage: false
    }

    //Grouped Horizontal Bar
    var durationPerStageWeb = new Array (getStages.length).fill(0);
    var durationPerStageDM = new Array (getStages.length).fill(0);

    for (i = 0; i < filteredTimers.length; i++) {
      for (x = 0; x < getStages.length; x++) {
        if (getStages[x] === filteredTimers[i].Stage) {
          if (filteredTimers[i].Type === 'web')
            durationPerStageWeb[x] += Math.ceil(filteredTimers[i].Duration);
          else
            durationPerStageDM[x] += Math.ceil(filteredTimers[i].Duration);
        }
      }
    }

    const groupedHoursPerType = {
      chartTitle: 'Web/DM Step Comparison',
      chartSubtitle: ' ',
      chartSeriesWeb: durationPerStageWeb,
      chartSeriesDM: durationPerStageDM,
      chartCategories: getStages
    }
    const timeCharts = chartColors.stages
    const dmChart = chartColors.webDmAdmin

    let peopleInvolved = [...new Set(webProjects.map(item => item.User))];

    return (
      //The key attribute on charts is being used to properly update them when date changes.
      <div className = "Work">
        <div className = "total-container">
          <div className = "count">
            <div>Web Projects</div>
            <div>{quantityWebProjects}</div>
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
        <div className = "donut-container">
          <Donut className = "row-donut" colorD = {donutTotalHours.color} chartTitle = {donutTotalHours.chartTitle} chartSubtitle = {donutTotalHours.chartSubtitle} chartSeries = {donutTotalHours.chartSeries} chartLabels = {donutTotalHours.chartLabels} key = {donutTotalHours.chartSeries}/>
          <Donut className = "row-donut" colorD = {donutHoursPerProject.color} chartTitle = {donutHoursPerProject.chartTitle} chartSubtitle = {donutHoursPerProject.chartSubtitle} chartSeries = {donutHoursPerProject.chartSeries} chartLabels = {donutHoursPerProject.chartLabels} key = {donutHoursPerProject.chartSeries}/>
          <Donut className = "row-donut" colorD = {donutTotalHoursXWork.color} chartTitle = {donutTotalHoursXWork.chartTitle} chartSubtitle = {donutTotalHoursXWork.chartSubtitle} chartSeries = {donutTotalHoursXWork.chartSeries} chartLabels = {donutTotalHoursXWork.chartLabels} key = {donutTotalHoursXWork.chartSeries}/>
        </div>
        <div className = "chart-container">
          <StackedHorizontalBar className = "row-bar" colorchartH = {timeCharts} chartTitle = {stacked250HoursPerWebProject.chartTitle} chartSubtitle = {stacked250HoursPerWebProject.chartSubtitle} chartSeries = {stacked250HoursPerWebProject.chartSeries} chartCategories = {stacked250HoursPerWebProject.chartCategories} chartShowLabels = {stacked250HoursPerWebProject.chartShowLabels} chartStackType = {stacked250HoursPerWebProject.chartStackType} chartPercentage = {stacked250HoursPerWebProject.chartPercentage} key = {stacked250HoursPerWebProject.chartCategories}/>
          <StackedHorizontalBar className = "row-bar" colorchartH = {timeCharts} chartTitle = {stackedBetween100And250HrsPerWebProject.chartTitle} chartSubtitle = {stackedBetween100And250HrsPerWebProject.chartSubtitle} chartSeries = {stackedBetween100And250HrsPerWebProject.chartSeries} chartCategories = {stackedBetween100And250HrsPerWebProject.chartCategories} chartShowLabels = {stackedBetween100And250HrsPerWebProject.chartShowLabels} chartStackType = {stackedBetween100And250HrsPerWebProject.chartStackType} chartPercentage = {stackedBetween100And250HrsPerWebProject.chartPercentage} key = {stackedBetween100And250HrsPerWebProject.chartCategories}/>
          <StackedHorizontalBar className = "row-bar" colorchartH = {timeCharts} chartTitle = {stackedBetween20And100HrsPerWebProject.chartTitle} chartSubtitle = {stackedBetween20And100HrsPerWebProject.chartSubtitle} chartSeries = {stackedBetween20And100HrsPerWebProject.chartSeries} chartCategories = {stackedBetween20And100HrsPerWebProject.chartCategories} chartShowLabels = {stackedBetween20And100HrsPerWebProject.chartShowLabels} chartStackType = {stackedBetween20And100HrsPerWebProject.chartStackType} chartPercentage = {stackedBetween20And100HrsPerWebProject.chartPercentage} key = {stackedBetween20And100HrsPerWebProject.chartCategories}/>
          <StackedHorizontalBar className = "row-bar" colorchartH = {timeCharts} chartTitle = {stackedLess20HoursPerWebProject.chartTitle} chartSubtitle = {stackedLess20HoursPerWebProject.chartSubtitle} chartSeries = {stackedLess20HoursPerWebProject.chartSeries} chartCategories = {stackedLess20HoursPerWebProject.chartCategories} chartShowLabels = {stackedLess20HoursPerWebProject.chartShowLabels} chartStackType = {stackedLess20HoursPerWebProject.chartStackType} chartPercentage = {stackedLess20HoursPerWebProject.chartPercentage} key = {stackedLess20HoursPerWebProject.chartCategories}/>
        </div>
        <div className = "chart-dm-container">
          <StackedHorizontalBar className = "row-grouped" colorchartH = {timeCharts} chartTitle = {stackedHoursPerDMProject.chartTitle} chartSubtitle = {stackedHoursPerDMProject.chartSubtitle} chartSeries = {stackedHoursPerDMProject.chartSeries} chartCategories = {stackedHoursPerDMProject.chartCategories} chartShowLabels = {stackedHoursPerDMProject.chartShowLabels} chartStackType = {stackedHoursPerDMProject.chartStackType} chartPercentage = {stackedHoursPerDMProject.chartPercentage} key = {stackedHoursPerDMProject.chartCategories}/>
          <GroupedHorizontalBar className = "row-grouped" colorchartGR = {dmChart} chartTitle = {groupedHoursPerType.chartTitle} chartSubtitle = {groupedHoursPerType.chartSubtitle} chartSeriesWeb = {groupedHoursPerType.chartSeriesWeb} chartSeriesDM = {groupedHoursPerType.chartSeriesDM} chartCategories = {groupedHoursPerType.chartCategories} key = {groupedHoursPerType.chartSeriesWeb}/>
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

export default connect(mapStateToProps)(Work);