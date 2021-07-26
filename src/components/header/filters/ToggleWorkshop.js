import React from 'react';
import { connect } from 'react-redux';
import { toggleWorkshop } from '../../../actions';
import Toggle from 'react-toggle';

import "react-toggle/style.css";

export const ToggleWorkshopComponent = (props) => (
  <Toggle
    defaultChecked={props.workshop}
    onChange={props.toggleWorkshop}
    icons={false}
  />
)

const mapStateToProps = (state) => ({
  workshop: state.toggleWorkshop.workshop
});

const mapDispatchToProps = (dispatch) => ({
  toggleWorkshop: (workshop) => dispatch(toggleWorkshop(workshop))
});

export const ToggleWorkshop = connect (mapStateToProps, mapDispatchToProps)(ToggleWorkshopComponent)