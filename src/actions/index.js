export const setStartDate = startDate => ({
  type: 'SET_START_DATE',
  startDate
})

export const setEndDate = endDate => ({
  type: 'SET_END_DATE',
  endDate
})

export const getDataTimers = dataTimers => ({
  type: 'GET_DATA_TIMERS',
  dataTimers
})

export const toggleWorkshop = workshop => ({
  type: 'TOGGLE_WORKSHOP',
  workshop
})

export const setRoles = roles => ({
  type: 'SET_ROLES',
  roles
})

export const setUser = user => ({
  type: 'SET_USER',
  user
})

export const setUsers = users => ({
  type: 'SET_USERS',
  users
})