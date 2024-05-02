import {
    ADD_TENENT_DATA,
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    SHOW_MESSAGE,
} from 'shared/constants/ActionTypes';
import { appIntl } from '@crema/utility/helper/Utils';
import jwtAxios from '@crema/services/auth/jwt-auth';


export const onAddNewTenent = (board) => {
    const { messages } = appIntl();
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        jwtAxios
            .post('/api/scrumboard/add/board', { board })
            .then((data) => {
                if (data.status === 200) {
                    dispatch({ type: FETCH_SUCCESS });
                    dispatch({ type: ADD_TENENT_DATA, payload: data.data });
                    dispatch({
                        type: SHOW_MESSAGE,
                        payload: messages['scrumBoard.boardAdded'],
                    });
                } else {
                    dispatch({
                        type: FETCH_ERROR,
                        payload: messages['message.somethingWentWrong'],
                    });
                }
            })
            .catch((error) => {
                dispatch({ type: FETCH_ERROR, payload: error.message });
            });
    };
};


