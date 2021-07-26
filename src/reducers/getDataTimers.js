import dataTimers from '../mockdata.json';

/*
  Need to filter timers here, date, workshop, extra hours, etc.
    https://stackoverflow.com/questions/34003553/redux-what-is-the-correct-way-to-filter-a-data-array-in-reducer
    https://medium.com/@matthew.holman/what-is-a-redux-selector-a517acee1fe8
    https://redux.js.org/recipes/computing-derived-data/
    https://react-redux.js.org/next/api/hooks
    https://redux.js.org/faq/reducers/
 */

const getDataTimers = (state = dataTimers, action) => {
  switch (action.type) {
    case 'GET_DATA_TIMERS':
      return {...state, dataTimers: action.dataTimers};
    default:
      return state;
  }
}

export default getDataTimers;