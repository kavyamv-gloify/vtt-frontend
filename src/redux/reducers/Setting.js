import {
  SET_INITIAL_PATH,
  TOGGLE_NAV_COLLAPSED,
  SOS_CLICKED,
  GET_LEAVE_DATA,
  GET_ADHOC_DATA,
  GET_ADHOC_DATA_MANAGER,
  GET_SCHEDULE_DATA_MANAGER,
  PERMISSIONS_CHECK,
  GET_COMPANY_NAME,
  GET_LEAVE_DATA_MANAGER,
} from 'shared/constants/ActionTypes';

const initialSettings = {
  navCollapsed: false,
  initialPath: '/',
  leaveCount: '',
  adhocCount: '',
  leaveCountManager: '',
  adhocCountManager: '',
  scheduleCountManager: '',
  permissions: null,
  company_name: '',
};

const settingsReducer = (state = initialSettings, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        navCollapsed: false,
      };

    case TOGGLE_NAV_COLLAPSED:
      return {
        ...state,
        navCollapsed: !state.navCollapsed,
      };

    case SOS_CLICKED:
      return {
        ...state,
        clickedSOS: !state.clickedSOS,
      };

    case SET_INITIAL_PATH:
      return {
        ...state,
        initialPath: action.payload,
      };
    case GET_LEAVE_DATA:
      return {
        ...state,
        leaveCount: action.payload,
      };
    case GET_LEAVE_DATA_MANAGER:
      return {
        ...state,
        leaveCountManager: action.payload,
      };
    case PERMISSIONS_CHECK:
      return {
        ...state,
        permissions: action.payload,
      };
    case GET_ADHOC_DATA:
      console.log('state', state);
      return {
        ...state,
        adhocCount: action.payload,
      };
    case GET_ADHOC_DATA_MANAGER:
      return {
        ...state,
        adhocCountManager: action.payload,
      };
    case GET_SCHEDULE_DATA_MANAGER:
      return {
        ...state,
        scheduleCountManager: action.payload,
      };
    case GET_COMPANY_NAME:
      return {
        ...state,
        company_name: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
