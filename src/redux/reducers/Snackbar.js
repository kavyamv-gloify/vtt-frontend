import {
    SET_SNACKBAR
} from 'shared/constants/ActionTypes';
const initialState = {
    snackbarOpen: false,
    snackbarType: "success",
    snackbarMessage: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SNACKBAR:
            const { snackbarOpen, snackbarMessage, snackbarType } = action;
            return {
                ...state,
                snackbarOpen,
                snackbarType,
                snackbarMessage
            };
        default:
            return state;
    }
};

// export const setSnackbar = (
//     snackbarOpen,
//     snackbarType = "success",
//     snackbarMessage = ""
// ) => ({
//     type: SET_SNACKBAR,
//     snackbarOpen,
//     snackbarType,
//     snackbarMessage
// });
