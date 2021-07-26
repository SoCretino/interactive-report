import React, { Component } from 'react';
import Chart from 'react-apexcharts';

import { defaultChartSettings, donutChartSettings } from '../../ChartSettings';

class Donut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        series: this.props.chartSeries,
        labels: this.props.chartLabels,
        dataLabels: {
          formatter: function(val, opt) {
            return [opt.w.globals.series[opt.seriesIndex] + " h", Math.round(val) + '%'];  //Math.round() is used to always return 100% percentage.
          }
        },
        chart: {
          fontFamily: defaultChartSettings.FONT_STACK,
          background: defaultChartSettings.BACKGROUND_COLOR
        },
        plotOptions: {
          pie: {
            expandOnClick: donutChartSettings.EXPAND_ON_CLICK,
            donut: {
              labels: {
                show: defaultChartSettings.LABEL_TOTAL,
                name: {
                  show: true
                },
                value: {
                  show: true
                },
                total: {
                  show: true
                }
              }
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + ' h';
            }
          }
        },
        title: {
          text: this.props.chartTitle,
          align: defaultChartSettings.TITLE_ALIGN,
          offsetY: defaultChartSettings.TITLE_OFFSET_Y,
          style: {
            fontSize: defaultChartSettings.TITLE_FONT_SIZE,
            fontWeight: defaultChartSettings.TITLE_FONT_WEIGHT,
            color: defaultChartSettings.TITLE_FONT_COLOR
          }
        },
        subtitle: {
          offsetY: 50,
          text: this.props.chartSubtitle,
          align: defaultChartSettings.TITLE_ALIGN,
          style: {
            fontSize: defaultChartSettings.SUBTITLE_FONT_SIZE,
            fontWeight: defaultChartSettings.SUBTITLE_FONT_WEIGHT,
            color: defaultChartSettings.TITLE_FONT_COLOR
          }
        },
        legend: {
          position: defaultChartSettings.LEGEND_POSITION,
          horizontalAlign: defaultChartSettings.LEGEND_HORIZONTAL_ALIGN,
          offsetY: -5
        },
        noData: {
          text: 'Sin datos',
          align: 'center',
          verticalAlign: 'middle'
        },
        stroke: {
          width: defaultChartSettings.STROKE_WIDTH,
          colors: [defaultChartSettings.STROKE_COLOR]
        },
        colors: this.props.colorD
      }
    };
  }

  render() {
    return (
      <Chart
        options = {this.state.options}
        series = {this.state.options.series}
        type = "donut"
      />
    );
  }
}

export default Donut;