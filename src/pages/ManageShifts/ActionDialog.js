import React, {useState, useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {Button, TextField} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {useForm} from 'react-hook-form';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    minHeight: '200px',
    minWidth: '400px',
    '& h2': {
      fontSize: '1.6rem',
      fontWeight: '700',
    },
    '& div': {
      width: '100%',
    },
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ActionDialog = (props) => {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm();
  const [result, setResult] = useState(null);

  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    reset({remarks: ''});
    props.handleConfirm(data.remarks);
  };

  return (
    <Dialog
      onClose={props.handleClose}
      aria-labelledby='customized-dialog-title'
      open={props.open}
    >
      <DialogTitle id='customized-dialog-title' onClose={props.handleClose}>
        {props.title}
      </DialogTitle>
      <DialogContent dividers>
        <p>Are you sure, you want to confirm?</p>

        {/* {(props.btnName == 'reject') ? */}
        <form>
          <TextField
            label='Remarks'
            multiline
            rows={4}
            variant='outlined'
            {...register('remarks', {
              required: props.btnName == 'REJECT' ? true : false,
              maxLength: 20,
            })}
          />
          <div className='text-error'>
            {errors.remarks && props.btnName == 'REJECT' && (
              <span style={{color: 'red'}}>Remarks fill mandatory.</span>
            )}
          </div>
        </form>
        {/* : null
                }   */}
      </DialogContent>
      <DialogActions>
        <Button
          id='btnMui123'
          onClick={props.handleCloseDialog}
          color='primary'
        >
          Cancel
        </Button>
        <Button
          id='btnMui123'
          // onClick={() => { props.handleConfirm(inputRem) }}
          onClick={handleSubmit((d) => onSubmit(d))}
          color='primary'
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
