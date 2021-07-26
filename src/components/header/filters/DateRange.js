import React from 'react';
import { connect } from 'react-redux';
import { setStartDate, setEndDate } from '../../../actions';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export const DateRangeComponent = (props) => (
  <>
    <DatePicker
      selected = {props.startDate}
      onChange = {props.setStartDate}
      minDate = {props.minDate}
      maxDate = {props.endDate}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode = "select"
      className = "datepicker"
    />
    <DatePicker
      selected = {props.endDate}
      onChange = {props.setEndDate}
      minDate = {props.startDate}
      maxDate = {props.maxDate}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode = "select"
      className = "datepicker"
    />
  </>
)

const mapStateToProps = (state) => ({
  startDate: state.setDate.startDate,
  endDate: state.setDate.endDate,
  minDate: state.setDate.minDate,
  maxDate: state.setDate.maxDate
});

const mapDispatchToProps = (dispatch) => ({
  setStartDate: (date) => dispatch (setStartDate(date)),
  setEndDate: (date) => dispatch (setEndDate(date))
});

export const DateRange = connect(mapStateToProps, mapDispatchToProps)(DateRangeComponent)