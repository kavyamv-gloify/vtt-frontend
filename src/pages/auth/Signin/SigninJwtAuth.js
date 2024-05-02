import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {Checkbox} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import AppInfoView from '@crema/core/AppInfoView';
import {Link, useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import AppTextField from '@crema/core/AppFormComponents/AppTextField';
import AppSelectField from '@crema/core/AppFormComponents/AppSelectField';
import OtpInput from 'react-otp-input';
import {useAuthMethod} from '@crema/utility/AuthHooks';
import {Fonts} from 'shared/constants/AppEnums';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {toast} from 'react-toastify';
import EmpolyeeRequestForm from '../EmployeeRequest';
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = yup.object({
  mobile: yup
    .string()
    .matches(regex.phoneORemailReg, 'Please enter valid login Id')
    .required(<IntlMessages id='validation.mobileEmailRequired' />),
  userType: yup.string().required('Color is required!'),
});
const validationSchema2 = yup.object({
  otp: yup
    .string()
    .matches(regex.otpRegex, 'Please enter valid OTP')
    .required(<IntlMessages id='validation.passwordRequired' />),
});
// const validationSchema = yup.object({
//   email: yup
//     .string()
//     .email(<IntlMessages id='validation.emailFormat' />)
//     .required(<IntlMessages id='validation.emailRequired' />),
//   password: yup
//     .string()
//     .required(<IntlMessages id='validation.passwordRequired' />),
// });

const SigninJwtAuth = ({mySecFunc, setOpenDial}) => {
  const navigate = useNavigate();
  const [otpd, setOtpd] = useState(false);
  const [udata, setUdata] = useState(null);
  const [disablebtn, setDisablebtn] = useState(true);
  const [check, setCheck] = useState(true);
  const {signInUser} = useAuthMethod();
  const [resend, setResend] = useState();
  const [otpsender, setOtpsender] = useState(false);
  const [counter, setCounter] = useState(59);
  const [open, setOpen] = useState(false);
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const onGoToForgetPassword = () => {
    navigate('/forget-password', {tab: 'jwtAuth'});
  };

  const {messages} = useIntl();

  const changeHandler = (event) => {
    mySecFunc(event);

    setCheck(event.target.checked);
    if (event.target.checked === true) {
      setDisablebtn(false);
    } else {
      setDisablebtn(true);
    }
  };

  useEffect(() => {
    if (otpsender) {
      const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
    setOtpsender(false);
  }, [otpsender, counter]);

  const handleDialog = () => {
    setOpen(true);
  };

  const resendfunction = () => {
    setCounter(59);
  };

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
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', mb: 5}}>
          {/* <span style={{marginTop:"15px", fontWeight:"500", fontSize:"15px", color:"#959595"}}>OR</span> */}
          {!otpd && (
            <Formik
              validateOnChange={true}
              initialValues={{
                // mobile: 9771082642,
                mobile: '',
                userType: 'ddfdf',
              }}
              validationSchema={validationSchema}
              onSubmit={(data, {setSubmitting}) => {
                setResend(data?.mobile);
                setDisablebtn(true);
                setSubmitting(true);
                localStorage.setItem('loginWith', data.mobile);
                axios
                  .post(`${api.auth.getOTP}`, {loginId: data.mobile})
                  .then(({data}) => {
                    if (
                      data?.status == '200' &&
                      data.data.userRole != 'DRIVER'
                    ) {
                      console.log('data', data);
                      setUdata(data.data);
                      setOtpd(true);
                    } else if (data?.status == '501') {
                      toast.error(data?.message || 'User Deactivated.');
                    } else {
                      toast.error(data?.data?.message ?? 'User does not exist');
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                    toast.error('Something went wrong');
                  });
                setSubmitting(false);
                setDisablebtn(false);
              }}
            >
              {({isSubmitting, handleChange, values}) => (
                <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                  <Box sx={{mb: {xs: 5, xl: 8}}}></Box>
                  <Box sx={{mb: {xs: 5, xl: 8}}}>
                    <AppTextField
                      placeholder={messages['common.mobileEmailplaceholder']}
                      type='mobile'
                      name='mobile'
                      label={<IntlMessages id='common.mobileEmail' />}
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Box>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: '1rem',
                      }}
                    >
                      <div style={{marginTop: '-12px'}}>
                        <Checkbox value={check} onChange={changeHandler} />
                      </div>
                      <div>
                        <p>
                          You agree to the{' '}
                          <span style={{color: '#00A0F3'}}>
                            <a
                              style={{color: '#00A0F3'}}
                              href='https://etravelmate.com/disclaimer/'
                            >
                              terms of use
                            </a>
                          </span>{' '}
                          and acknowledge the{' '}
                          <span style={{color: '#00A0F3'}}>
                            <a
                              style={{color: '#00A0F3'}}
                              href=' https://etravelmate.com/privacy-policy/'
                            >
                              privacy policy
                            </a>
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                    <div>
                      {!check && (
                        <p
                          style={{
                            marginLeft: '1.7rem',
                            fontSize: '12px',
                            color: '#e3242b',
                            marginTop: '-1rem',
                            marginBottom: '1rem',
                          }}
                        >
                          Please agree to the term and condition
                        </p>
                      )}
                    </div>
                  </div>

                  {/* -----------------------submit section-------------------------------- */}
                  <div>
                    <Button
                      id='btnMui123'
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={disablebtn}
                      onClick={() => setOtpsender(true)}
                      sx={{
                        fontWeight: Fonts.REGULAR,
                        width: '100%',
                        fontSize: 16,
                        textTransform: 'capitalize',
                      }}
                    >
                      <IntlMessages id='common.getOtp' />
                    </Button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px',
                    }}
                  >
                    <p>
                      New User?
                      <span
                        style={{marginLeft: '0.5rem', color: '#00A0F3'}}
                        onClick={() => {
                          setOpenDial(true);
                        }}
                      >
                        <a href='#' style={{color: '#00A0F3'}}>
                          SignUp
                        </a>
                      </span>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {otpd && udata && udata.loginId && (
            <Formik
              initialValues={{
                otp: '',
              }}
              validateOnChange={true}
              validationSchema={validationSchema2}
              onSubmit={(data, {setSubmitting}) => {
                setDisablebtn(true);
                setSubmitting(true);
                signInUser({
                  type: 'normal',
                  uid: udata.id,
                  otp: data.otp,
                });
                setDisablebtn(false);
                setSubmitting(false);
              }}
            >
              {({isSubmitting, setFieldValue, values}) => (
                <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marignTop: '4rem',
                    }}
                  >
                    <Box sx={{mb: {xs: 5, xl: 8}}}>
                      <h5
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          marignTop: '4rem',
                        }}
                      >
                        Enter OTP
                      </h5>
                      <OtpInput
                        name='otp'
                        value={values.otp}
                        onChange={(otp) => {
                          setFieldValue('otp', otp);
                        }}
                        shouldAutoFocus={true}
                        numInputs={6}
                        separator={<span>-</span>}
                        inputStyle={{
                          minWidth: 32,
                          minHeight: 40,
                          fontWeight: Fonts.REGULAR,
                          fontSize: 16,
                          textTransform: 'capitalize',
                          // padding: '4px 16px 8px',
                        }}
                      />
                    </Box>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <Button
                        id='btnMui123'
                        style={{width: '10%'}}
                        variant='contained'
                        color='primary'
                        type='submit'
                        onClick={(e) => {
                          if (!values.otp || typeof values.otp == 'string') {
                            signInUser({
                              type: 'normal',
                              uid: udata.id,
                              otp: values.otp ?? '',
                            });
                          }
                        }}
                        disabled={isSubmitting}
                        sx={{
                          minWidth: 160,
                          fontWeight: Fonts.REGULAR,
                          fontSize: 16,
                          textTransform: 'capitalize',
                          // padding: '4px 16px 8px',
                        }}
                      >
                        <IntlMessages id='common.submit' />
                      </Button>
                    </div>

                    {
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '1rem',
                        }}
                      >
                        <span>00:{counter < 10 ? '0' + counter : counter}</span>
                      </div>
                    }

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '1rem',
                      }}
                    >
                      <span
                        style={{fontSize: '1rem', color: '#00A0F3'}}
                        onClick={() => {
                          setOtpsender(true);

                          axios
                            .post(`${api.auth.getOTP}`, {loginId: resend})
                            .then(({data}) => {
                              if (
                                data?.status == '200' &&
                                data.data.userRole != 'DRIVER'
                              ) {
                                setUdata(data.data);
                                setOtpd(true);
                              } else if (data?.status == '501') {
                                toast.error(
                                  data?.message || 'User Deactivated.',
                                );
                              } else {
                                toast.error(
                                  data?.data?.message ??
                                    'User does not exist, Please SignUp',
                                );
                              }
                            })
                            .catch((e) => {
                              toast.error('Something went wrong');
                            });
                          // setSubmitting(false);
                          setDisablebtn(false);
                        }}
                        disabled={isSubmitting}
                      >
                        <a
                          style={{color: '#00A0F3'}}
                          href='#'
                          onClick={resendfunction}
                        >
                          {' '}
                          Resend OTP
                        </a>
                      </span>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Box>

        <Box
          sx={{
            color: 'grey.500',
          }}
        >
          <Box
            component='span'
            sx={{
              fontWeight: Fonts.MEDIUM,
              '& a': {
                color: (theme) => theme.palette.primary.main,
                textDecoration: 'none',
              },
            }}
          ></Box>
        </Box>

        <AppInfoView />
      </Box>{' '}
    </>
  );
};

export default SigninJwtAuth;
