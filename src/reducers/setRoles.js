const initialState = {
  roles: 'All Roles'
};

const setRoles = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ROLES':
      return {...state, roles: action.roles};
    default:
      return state;
  }
}

export default setRoles;