import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AuthWrapper from '../AuthWrapper';
// import SigninFirebase from './SigninFirebase';
import SigninJwtAuth from './SigninJwtAuth';
import AppLogo from '@crema/core/AppLayout/components/AppLogo';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Login from './users'
import GoogleLogin from './GoogleLogin';
import LoginPage from '../LoginPage';
import SocialLogin from './SocialLogin'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: '#00000000',
  // border: '2px solid #000',
  // boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Signin = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => {
    // setOpen(true);
    navigate('/login');
    // history.push('/signin-user');
  };
  const handleClose = () => {
    setOpen(false);
  };


  return (
    // <Login />
    // <LoginPage/>
    <SocialLogin/>
  );
};

export default Signin;
