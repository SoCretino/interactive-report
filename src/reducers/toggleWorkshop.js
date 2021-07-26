const initialState = {
  workshop: false
};

const toggleWorkshop = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_WORKSHOP':
      return {...state, workshop: !state.workshop};
    default:
      return state;
  }
}

export default toggleWorkshop;