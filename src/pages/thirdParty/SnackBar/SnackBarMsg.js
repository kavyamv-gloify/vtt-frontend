import React, { Children } from 'react'
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const SnackbarCustom = (props) => {
  var { BooleanValue, open, children } = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    changeState(false);
  };
  function changeState(event) {
    props.onChange(event);
  }
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={BooleanValue ? "success" : "error"}>
          {children}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SnackbarCustom;