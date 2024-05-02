import React, {useState} from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {Checkbox} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';

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
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = yup.object({
  mobile: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(<IntlMessages id='validation.mobileRequired' />),
  userType: yup.string().required('Color is required!'),
});

const SigninJwtAuth = () => {
  const navigate = useNavigate();
  const [otpd, setOtpd] = useState(false);
  const [udata, setUdata] = useState(null);
  const {signInUser} = useAuthMethod();
  const onGoToForgetPassword = () => {
    navigate('/forget-password', {tab: 'jwtAuth'});
  };

  const {messages} = useIntl();

  return (
    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', mb: 5}}>
        {!otpd && (
          <Formik
            validateOnChange={true}
            initialValues={{
              mobile: 8447038233,
              userType: 'SUPERADMIN',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              axios
                .post(`${api.auth.getOTP}/${data.mobile}/${data.userType}`)
                .then(({data}) => {
                  if (
                    data.data.password != '' &&
                    data.data.userRole != 'DRIVER'
                  ) {
                    setUdata(data.data);
                    setOtpd(true);
                  }
                });
              setSubmitting(false);
            }}
          >
            {({isSubmitting, handleChange, values}) => (
              <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                <Box sx={{mb: {xs: 5, xl: 8}}}>
                  <AppSelectField
                    placeholder={messages['common.utype']}
                    name='userType'
                    label={<IntlMessages id='common.utype' />}
                    variant='outlined'
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value='SUPERADMIN'>Super Admin</MenuItem>
                    <MenuItem value='TANENTADMIN'>Tenant</MenuItem>
                    <MenuItem value='CORPORATEADMIN'>Corporate</MenuItem>
                    <MenuItem value='VENDOR'>Vendor</MenuItem>
                    <MenuItem value='DRIVER'>Driver</MenuItem>
                    <MenuItem value='EMPLOYEE'>Employee</MenuItem>
                  </AppSelectField>
                </Box>
                <Box sx={{mb: {xs: 5, xl: 8}}}>
                  <AppTextField
                    placeholder={messages['common.mobile']}
                    type='mobile'
                    name='mobile'
                    label={<IntlMessages id='common.mobile' />}
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
                  <Button
                    id='btnMui123'
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting}
                    sx={{
                      fontWeight: Fonts.REGULAR,
                      fontSize: 16,
                      textTransform: 'capitalize',
                    }}
                  >
                    <IntlMessages id='common.getOtp' />
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
        {otpd && udata && udata.id && (
          <Formik
            initialValues={{
              otp: null,
            }}
            // validateOnChange={true}
            // validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              signInUser({
                uid: udata.id,
                otp: data.otp,
              });
              setSubmitting(false);
            }}
          >
            {({isSubmitting, setFieldValue, values}) => (
              <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                <Box sx={{mb: {xs: 5, xl: 8}}}>
                  <h5 style={{marginBottom: '10px'}}>Enter OTP</h5>
                  <OtpInput
                    name='otp'
                    value={values.otp}
                    onChange={(otp) => {
                      setFieldValue('otp', otp);
                    }}
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
                <div>
                  <Button
                    id='btnMui123'
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting}
                    sx={{
                      // minWidth: 160,
                      fontWeight: Fonts.REGULAR,
                      fontSize: 16,
                      textTransform: 'capitalize',
                      // padding: '4px 16px 8px',
                    }}
                  >
                    <IntlMessages id='common.submit' />
                  </Button>
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
    </Box>
  );
};

export default SigninJwtAuth;
