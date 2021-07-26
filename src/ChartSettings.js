import { fontStack, fontSizeTitle, fontSizeSubtitle, fontBold, fontRegular, colorChart } from './styles/font-style.scss';

/* Default chart settings, shared among all types */

export const defaultChartSettings = {
  BACKGROUND_COLOR: '#FFF',
  LABEL_TOTAL: false,

  FONT_STACK: fontStack,

  //Title
  TITLE_ALIGN: 'center',
  TITLE_OFFSET_Y: 22,
  TITLE_FONT_SIZE: fontSizeTitle,
  TITLE_FONT_WEIGHT: fontBold,
  TITLE_FONT_COLOR: colorChart,

  //Subtitle
  SUBTITLE_FONT_SIZE: fontSizeSubtitle,
  SUBTITLE_FONT_WEIGHT: fontRegular,

  //Legend
  LEGEND_POSITION: 'top',
  LEGEND_HORIZONTAL_ALIGN: 'right',

  //Border
  STROKE_WIDTH: 0,  //Border width. Set to 0 to disable.
  STROKE_COLOR: '#000',  //This is an array that takes multiple colors, but we should keep it simple and use just one.

  //Toolbar - Save chart as SVG/PNG
  TOOLBAR_SHOW: false
}

/* Exclusive chart settings, per chart type */

//Donut Chart
export const donutChartSettings = {
  EXPAND_ON_CLICK: false
}

/*Colors by Chart info*/

//Comments describe the order by color
export const chartColors = {
  webDmAdmin: ['#7563ff', '#5ae7cc', '#ed3e58'],  //Web | DM | Admin/tools
  activeHold: ['#5AD260', '#ffc637'], //Active | Hold
  stages: ['#01a2ff','#ff9100','#d5d5d5','#6a23b6','#e44def','#5ad260'], //Prep | Build | Screens | ISV | QA | Relase
  role: ['#ff4e00','#67cc00','#830996','#186dc7','#47c2bc']  //Project Leader | PM | PD | Dev Sr | Dev Jr
}