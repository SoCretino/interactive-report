import React, { Component } from 'react';
import Chart from 'react-apexcharts';

import { defaultChartSettings } from '../../ChartSettings';

class StackedHorizontalBar extends Component {
  constructor(props) {
    super(props);
    this.keys = Object.keys(this.props.chartSeries[0]);
    this.buildSeries = Object.keys(this.props.chartSeries).map(
      function (a) {
        return {
          name: this.props.chartSeries[a][this.keys[0]],
          data: this.props.chartSeries[a][this.keys[1]]
        }
      }, this
    );
    this.state = {
      options: {
        series: this.buildSeries,
        xaxis: {
          categories: this.props.chartCategories,
          labels: {
            trim: false,
            formatter: function (val) {
              if (props.chartPercentage === false)
                return val + ' h';
              else
                return val + '%';
            }
          }
        },
        chart: {
          height:"auto",
          fontFamily: defaultChartSettings.FONT_STACK,
          background: defaultChartSettings.BACKGROUND_COLOR,
          stacked: true,
          stackType: this.props.chartStackType,
          toolbar: {
            show: defaultChartSettings.TOOLBAR_SHOW
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '32%',
          }
        },
        dataLabels: {
          enabled: this.props.chartShowLabels
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
          offsetY: 57,
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
          offsetY: -10,
          markers: {
            radius: 10
          }
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
        responsive: [
          {
            breakpoint: 1000,
            options: {
              plotOptions: {
                bar: {
                  horizontal: false
                }
              },
              legend: {
                position: "top"
              },
              xaxis: {
                labels: {
                 trim: true,
                  formatter: function (val) {
                    return val;
                  }
                }
              },
            }
          }
        ],
        colors: this.props.colorchartH
      }
    };
  }

  render() {// eslint-disable-next-line
    var barHeight;
    let barCount = this.state.options.xaxis.categories.length
    return (
      <Chart
        options = {this.state.options}
        series = {this.state.options.series}
        type = "bar"
        height = {barCount <= 5 ? barHeight = '400px' : barHeight= '1300px'}  //We'll set height dynamically here.
      />
    );
  }
}

export default StackedHorizontalBar;