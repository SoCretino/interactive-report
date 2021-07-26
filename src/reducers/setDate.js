const initialState = {
  startDate: new Date ("1/1/2019"),
  endDate: new Date ("12/31/2019"),
  minDate: new Date ("1/1/2019"), //Fetch min and max from timers.
  maxDate: new Date ("12/31/2019")
};

const setDate = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_START_DATE':
      return {...state, startDate: action.startDate};
    case 'SET_END_DATE':
      return {...state, endDate: action.endDate};
    default:
      return state;
  }
}

export default setDate;