import SigninJwtAuth from './SigninJwtAuth';
import React, {useState} from 'react';

import Card from '@mui/material/Card';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import {Checkbox, useTheme} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import Box from '@mui/material/Box';
import {grey} from '@mui/material/colors';
import {Fonts} from 'shared/constants/AppEnums';
import AppAnimate from '@crema/core/AppAnimate';
import AppTextField from '@crema/core/AppFormComponents/AppTextField';
import {ReactComponent as Logo} from '../../../assets/user/login.svg';
import GoogleLogin from './GoogleLogin';
import MicrosoftLogin from './MicrosoftLogin';
import SocialLogin from './SocialLogin';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

const validationSchema = yup.object({
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const Signin = () => {
  const theme = useTheme();
  const {messages} = useIntl();
  const [open, setOpen] = useState(false);

  const handleDialog = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
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
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <Box
        sx={{
          pb: 6,
          py: {xl: 8},
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            maxWidth: 700,
            width: '100%',
            // padding: 1,
            paddingLeft: {xs: 8, md: 2},
            overflow: 'hidden',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Grid container spacing={5} style={{padding: '60px'}}>
            {/* <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                '& svg': {
                  width: '100%',
                  height: '100%',
                  display: 'inline-block',
                  paddingRight: {xs: 0, lg: 10},
                },
              }}
            >
              <Logo fill={theme.palette.primary.main} />
            </Grid> */}
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  mb: {xs: 3, xl: 4},
                  fontWeight: Fonts.BOLD,
                  fontSize: 20,
                }}
              >
                <img src='/assets/images/tm-logo.jpeg' alt='P' />
                {/* <IntlMessages id='common.login' /> */}
              </Box>

              <SocialLogin />
              <p style={{textAlign: 'center', marginTop: '10px'}}>or</p>
              <SigninJwtAuth />
              <p>New User?</p>
              <button id='btnMui123' onClick={handleDialog}>
                SignUp
              </button>

              <div>
                <Dialog
                  open={open}
                  onClose={handleDialogClose}
                  PaperComponent={PaperComponent}
                  aria-labelledby='draggable-dialog-title'
                >
                  <DialogTitle
                    style={{cursor: 'move'}}
                    id='draggable-dialog-title'
                  >
                    Subscribe
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To subscribe to this website, please enter your email
                      address here. We will send updates occasionally.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      id='btnMui123'
                      autoFocus
                      onClick={handleDialogClose}
                    >
                      Cancel
                    </Button>
                    <Button id='btnMui123' onClick={handleDialogClose}>
                      Subscribe
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default Signin;
