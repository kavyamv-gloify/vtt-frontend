import React, {useCallback, useState} from 'react';
import jwt_decode from 'jwt-decode';
import SigninJwtAuth from './SigninJwtAuth';
import {LoginSocialGoogle, LoginSocialMicrosoft} from 'reactjs-social-login';
import {
  GoogleLoginButton,
  MicrosoftLoginButton,
} from 'react-social-login-buttons';
import EmpolyeeRequestForm from '../EmployeeRequest';
import LoginPage from '../LoginPage';
import {useAuthMethod} from '@crema/utility/AuthHooks';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import MicrosoftLogin from 'react-microsoft-login';
import CloseIcon from '@mui/icons-material/Close';

const REDIRECT_URI = 'https://uat.etravelmate.com/home';

const SocialLogin = () => {
  const {signInUser} = useAuthMethod();
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [openDial, setOpenDial] = useState(false);
  const [checkedChild, setcheckedChild] = useState(false);
  const onLoginStart = useCallback(() => {}, []);
  const mstoken = localStorage.getItem('msal.idtoken') || null;
  const mySecFunc = (event) => {
    setcheckedChild(event?.target?.checked);
  };
  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider('');
    //alert('logout success');
  }, []);
  const onLogout = useCallback(() => {}, []);

  const dialogOpen = (d) => {};

  const dialogClose = (f) => {};
  function myDial(status) {
    setOpenDial(status);
  }

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
  return (
    <>
      <div>
        <div
          style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}
        >
          {/* <img src="/assets/images/corplogo.svg" alt="P" /> */}
          <img src='/assets/images/tm-logo-2.svg' style={{height: '52px'}} />
        </div>
        <div
          style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}
        >
          <div
            style={{
              flexBasis: '50%',
              background: 'white',
              border: '2px solid white',
              borderRadius: '15px',
              padding: '3rem',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '-1rem',
                padding: '0px',
              }}
            >
              <h2>Members Sign Ins</h2>
            </div>

            <div
              style={{
                display: 'flex',
                opacity: checkedChild ? '' : '0.2',
                pointerEvents: checkedChild ? '' : 'none',
                justifyContent: 'center',
                alignContent: 'stretch',
                marginTop: '1rem',
              }}
            >
              <LoginSocialGoogle
                client_id='29733715718-qln2rjqj1qrchodojl74677lfnmr8qri.apps.googleusercontent.com'
                onLoginStart={onLoginStart}
                redirect_uri={REDIRECT_URI}
                scope='openid profile email'
                discoveryDocs='claims_supported'
                access_type='offline'
                onResolve={({provider, data}) => {
                  setFirstname(data?.given_name);
                  setLastname(data?.family_name);
                  setEmail(data?.email);

                  if (data?.verified_email) {
                    signInUser({
                      type: 'sso',
                      loginType: 'google',
                      otp: data.access_token,
                      uid: data.email,
                    });
                  }
                }}
                onReject={(err) => {}}
              >
                <GoogleLoginButton> </GoogleLoginButton>
              </LoginSocialGoogle>
              {mstoken ? (
                ''
              ) : (
                <MicrosoftLogin
                  clientId={'7e191a74-3d96-4ae6-8b80-ae1cfe3a73c1'}
                  authCallback={(err, data) => {
                    if (err) {
                    } else {
                      signInUser({
                        type: 'sso',
                        loginType: provider,
                        otp: data.idToken.rawIdToken,
                        uid: data.idToken.preferredName,
                      });
                    }
                  }}
                  redirectUri={REDIRECT_URI}
                  useLocalStorageCache={true}
                  children={<MicrosoftLoginButton> </MicrosoftLoginButton>}
                />
              )}
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <span
                style={{color: 'grey', fontWeight: 'bold', marginTop: '1rem'}}
              >
                OR
              </span>
            </div>

            <SigninJwtAuth mySecFunc={mySecFunc} setOpenDial={setOpenDial} />

            <Dialog
              open={openDial}
              onClose={() => {
                setOpenDial(false);
              }}
              sx={{
                '& .MuiDialog-container': {
                  '& .MuiPaper-root': {
                    width: '40%',
                  },
                },
              }}
              PaperComponent={PaperComponent}
              aria-labelledby='draggable-dialog-title'
              maxWidth='false'
              PaperProps={{
                sx: {
                  width: '30%',
                },
              }}
            >
              <DialogTitle id='alert-dialog-title'>
                <CloseIcon
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setOpenDial(false);
                  }}
                />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <img
                    src='/assets/images/tm-logo.jpeg'
                    alt='P'
                    style={{width: '15rem'}}
                  />
                </div>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <h1 style={{fontSize: '1rem', color: 'black'}}>
                    Create a new account
                  </h1>
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <h5>It's quick and easy.</h5>
                </div>
              </DialogTitle>

              <DialogContent>
                <DialogContentText>
                  <EmpolyeeRequestForm
                    first={firstname}
                    last={lastname}
                    mail={email}
                    corpList={'corpList'}
                    myDial={myDial}
                  />
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <span
                      autoFocus
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
              <DialogActions></DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialLogin;
