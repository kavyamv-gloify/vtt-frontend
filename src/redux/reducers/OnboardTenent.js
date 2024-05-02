import {
    ADD_TENENT_DATA
} from 'shared/constants/ActionTypes';
const initialState = {
    tenentBoardList: [],
};

const tenentBoardReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TENENT_DATA:
        return {
          ...state,
          tenentBoardList: state.tenentBoardList.concat(action.payload),
        };
      default:
        return state;
    }
  };
  export default tenentBoardReducer;


