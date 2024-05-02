import React, {useState, useEffect} from 'react';
import GoogleLogin from './Signin/GoogleLogin';
import SigninJwtAuth from './Signin/SigninJwtAuth';
import {Button} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import EmpolyeeRequestForm from './EmployeeRequest';
import SocialLogin from './Signin/SocialLogin';

const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();

  const styles = {
    parent: {
      display: 'grid',
      justifyContent: 'center',
    },
    image: {},
  };

  useEffect(() => {
    const first = localStorage.getItem('firstname');
  }, []);

  function PaperComponent(props) {
    return (
      <Draggable
        handle='#draggable-dialog-title'
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  const handleDialog = () => {
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div style={{background: '#f2f3f4'}}></div>
      <div style={styles.parent}>
        <img src='/assets/images/tm-logo.jpeg' alt='P' />
      </div>
      <div style={styles.parent}>
        <div
          style={{
            flexBasis: '50%',
            background: 'white',
            border: '2px solid white',
            borderRadius: '10px',
            padding: '3rem',
            marginTop: '2rem',
          }}
        >
          <h1
            style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Login
          </h1>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            {/* <GoogleLogin /> */}
            <SocialLogin />
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <span style={{color: 'grey', fontWeight: 'bold'}}>OR</span>
          </div>
          <SigninJwtAuth />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <p>
              New User?
              <span
                style={{marginLeft: '0.5rem', color: '#00A0F3'}}
                onClick={handleDialog}
              >
                <a href='#' style={{color: '#00A0F3'}}>
                  SignUp
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        // className='signup'
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '60%',
              // maxWidth: "100%",  // Set your width here
            },
          },
        }}
        // onClose={handleDialogClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
      >
        <DialogTitle id='alert-dialog-title'>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <img
              src='/assets/images/tm-logo.jpeg'
              alt='P'
              style={{width: '10rem'}}
            />
          </div>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <h1 style={{fontSize: '2rem', color: 'black'}}>
              Create a ssssssssnew account
            </h1>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <h5>It's quick and easy.</h5>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* To subscribe to this website, please enter your email address here. We
                        will send updates occasionally. */}

            <EmpolyeeRequestForm />
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <span
                autoFocus
                onClick={handleDialogClose}
                style={{
                  fontSize: '0.95rem',
                  color: '#00A0F3',
                  marginTop: '1.5rem',
                }}
              >
                <a href='#' style={{color: '#00A0F3'}}>
                  Already an User?
                </a>
              </span>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button id='btnMui123' autoFocus onClick={handleDialogClose}>
                        Cancel
                    </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginPage;
