import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import React, {useState} from 'react';

const Confirm = ({open, handleClose, cnfMsg, header, reason}) => {
  const [myInput, setMyInput] = useState('');
  return (
    <div>
      <Dialog
        open={open}
        // onClose={()=>{handleClose("NO")}}
        style={{background: 'rgb(59 59 59 / 25%)'}}
        aria-labelledby='alert-dialog-title'
        BackdropProps={{invisible: true}}
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' style={{fontSize: '16px'}}>
          {header}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p style={{fontSize: '15px'}}>{cnfMsg}</p>
            {reason && (
              <TextField
                sx={{mt: 4}}
                label='Reason'
                onInput={(e) => {
                  setMyInput(e.target.value);
                }}
                fullWidth
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id='btnMui123'
            onClick={(e) => {
              handleClose('YES', myInput);
            }}
          >
            Yes
          </Button>
          <Button
            id='btnMui123'
            onClick={(e) => {
              handleClose('NO', myInput);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Confirm;
