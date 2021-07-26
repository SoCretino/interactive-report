import React, { Component } from 'react';
import Chart from 'react-apexcharts';

import { defaultChartSettings } from '../../ChartSettings';

//Needs overall improvement, just a mock-up.

function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([baseval, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

class AreaStacked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        series: [
          {
            name: 'South',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 20
            })
          },
          {
            name: 'North',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 20
            })
          },
          {
            name: 'Central',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 15
            })
          }
        ],
        title: {
          text: this.props.chartTitle,
          align: defaultChartSettings.TITLE_ALIGN,
          offsetY: defaultChartSettings.TITLE_OFFSET_Y,
          style: {
            fontFamily: defaultChartSettings.FONT_STACK,
            fontSize: defaultChartSettings.TITLE_FONT_SIZE,
            fontWeight: defaultChartSettings.TITLE_FONT_WEIGHT,
            color: defaultChartSettings.TITLE_FONT_COLOR
          }
        },
        chart: {
          stacked: true,
          background: defaultChartSettings.BACKGROUND_COLOR,
          toolbar: {
            tools: {
              download: false,
              //Acá van mil pelotudeces más.
            },
          }
        },
        subtitle: {
          text: this.props.chartSubtitle,
          align: defaultChartSettings.TITLE_ALIGN,
          style: {
            fontFamily: defaultChartSettings.FONT_STACK,
            fontSize: defaultChartSettings.SUBTITLE_FONT_SIZE,
            fontWeight: defaultChartSettings.SUBTITLE_FONT_WEIGHT,
            color: defaultChartSettings.TITLE_FONT_COLOR
          }
        },
        legend: {
          position: defaultChartSettings.LEGEND_POSITION,
          horizontalAlign: defaultChartSettings.LEGEND_HORIZONTAL_ALIGN
        },
        noData: {
          text: 'Sin datos',
          align: 'center',
          verticalAlign: 'middle'
        },
        stroke: {
          curve: 'solid',
          width: defaultChartSettings.STROKE_WIDTH,
          colors: [defaultChartSettings.STROKE_COLOR]
        },
        fill: {
          type: 'solid'
        },
        colors: defaultChartSettings.COLORS
      }
    }
  }

  render() {
    return (
      <Chart
        options = {this.state.options}
        series = {this.state.options.series}
        type = "area"
      />
    );
  }
}

export default AreaStacked;