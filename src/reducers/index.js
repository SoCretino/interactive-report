import { combineReducers } from 'redux';

import setDate from './setDate';
import getDataTimers from './getDataTimers';
import toggleWorkshop from './toggleWorkshop';
import setRoles from './setRoles';
import setUser from './setUser';
import setUsers from './setUsers';

export default combineReducers({
  setDate,
  getDataTimers,
  toggleWorkshop,
  setRoles,
  setUser,
  setUsers
});