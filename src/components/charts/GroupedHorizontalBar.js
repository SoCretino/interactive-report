import React, { Component } from 'react';
import Chart from 'react-apexcharts';

import { defaultChartSettings } from '../../ChartSettings';

class GroupedHorizontalBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        /* Series should be returned dynamically */
        series: [
          {
            name: 'Web',
            data: this.props.chartSeriesWeb
          },
          {
            name: 'DM',
            data: this.props.chartSeriesDM
          }
        ],
        xaxis: {
          categories: this.props.chartCategories,
          labels: {
            trim: false,
            formatter: function (val) {
              return val + ' h';
            }
          }
        },
        chart: {
          fontFamily: defaultChartSettings.FONT_STACK,
          background: defaultChartSettings.BACKGROUND_COLOR,
          toolbar: {
            show: defaultChartSettings.TOOLBAR_SHOW
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
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
          offsetY: -10
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
        colors: this.props.colorchartGR
      }
    };
  }

  render() {
    return (
      <Chart
        options = {this.state.options}
        series = {this.state.options.series}
        type = "bar"
      />
    );
  }
}

export default GroupedHorizontalBar;