import {
    SET_SNACKBAR
  } from 'shared/constants/ActionTypes';
export const setSnackbar = (
    snackbarOpen,
    snackbarType = "success",
    snackbarMessage = ""
) => ({
    type: SET_SNACKBAR,
    snackbarOpen,
    snackbarType,
    snackbarMessage
});
