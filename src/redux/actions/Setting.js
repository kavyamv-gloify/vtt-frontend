import {
  SET_INITIAL_PATH,
  TOGGLE_NAV_COLLAPSED,
  SOS_CLICKED,
  PERMISSIONS_CHECK,
  GET_LEAVE_DATA,
  GET_LEAVE_DATA_MANAGER,
  GET_ADHOC_DATA,
  GET_ADHOC_DATA_MANAGER,
  GET_SCHEDULE_DATA_MANAGER,
  GET_COMPANY_NAME
} from 'shared/constants/ActionTypes';

export const toggleNavCollapsed = () => {
  return (dispatch) => dispatch({ type: TOGGLE_NAV_COLLAPSED });
};
export const sosClicked = () => {
  return (dispatch) => dispatch({ type: SOS_CLICKED });
};
export const permissionCheck = (d) => {
  return (dispatch) => dispatch({ type: PERMISSIONS_CHECK, payload: d });
};
export const setInitialPath = (initialPath) => {
  return (dispatch) => dispatch({ type: SET_INITIAL_PATH, payload: initialPath });
};

export const setLeaveCount = (count) => {
  return (dispatch) => dispatch({ type: GET_LEAVE_DATA, payload: count });
}

export const setAdhocCount = (count) => {
  return (dispatch) => dispatch({ type: GET_ADHOC_DATA, payload: count })
}

export const setLeaveCountManager = (count) => {
  return (dispatch) => dispatch({ type: GET_LEAVE_DATA_MANAGER, payload: count });
}

export const setAdhocCountManager = (count) => {
  return (dispatch) => dispatch({ type: GET_ADHOC_DATA_MANAGER, payload: count })
}

export const setScheduleCountManager = (count) => {
  return (dispatch) => dispatch({ type: GET_SCHEDULE_DATA_MANAGER, payload: count })
}

export const setCompanyName = (name) => {
  return (dispatch) => dispatch({ type: GET_COMPANY_NAME, payload: name })
}