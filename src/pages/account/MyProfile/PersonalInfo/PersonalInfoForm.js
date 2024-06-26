import React from 'react';
import {alpha, Box, Button, Typography} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '@crema/core/AppGridContainer';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/utility/IntlMessages';
import {useDropzone} from 'react-dropzone';
import {Form} from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '@crema/core/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import {styled} from '@mui/material/styles';
import {Fonts} from 'shared/constants/AppEnums';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
const AvatarViewWrapper = styled('div')(({theme}) => {
  return {
    position: 'relative',
    cursor: 'pointer',
    '& .edit-icon': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      zIndex: 1,
      border: `solid 2px ${theme.palette.background.paper}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.7),
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
      width: 26,
      height: 26,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    },
    '&.dropzone': {
      outline: 0,
      '&:hover .edit-icon, &:focus .edit-icon': {
        display: 'flex',
      },
    },
  };
});

const PersonalInfoForm = ({values, setFieldValue}) => {
  const navigate = useNavigate();
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('photoURL', URL.createObjectURL(acceptedFiles[0]));
    },
  });
  const {user} = useAuthUser();

  return (
    <Form noValidate autoComplete='off'>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: {xs: 3, lg: 4},
        }}
      >
        My Account (<IntlMessages id='common.personalInfo' />)
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: {xs: 5, lg: 6},
        }}
      >
        <AvatarViewWrapper {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <label htmlFor='icon-button-file'>
            <Avatar
              sx={{
                width: {xs: 50, lg: 64},
                height: {xs: 50, lg: 64},
                cursor: 'pointer',
              }}
              src={values.photoURL}
            />
            <Box className='edit-icon'>
              <EditIcon />
            </Box>
          </label>
        </AvatarViewWrapper>
        <Box
          sx={{
            ml: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: Fonts.MEDIUM,
            }}
          >
            {/* {values.displayName} */}
            {user?.userList?.userName}
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {values.email}
          </Typography>
        </Box>
      </Box>
      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='userName'
            defaultValue={values?.userList?.userName}
            fullWidth
            disabled
            label={<IntlMessages id='common.fullName' />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            fullWidth
            name='mobile'
            defaultValue={values?.userList?.mobileNo}
            label='Mobile No'
            // label={<IntlMessages id='common.userName'/>}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='email'
            fullWidth
            disabled
            label={<IntlMessages id='common.email' />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='location'
            fullWidth
            defaultValue={values?.userList?.location}
            label='Location'
            // label={<IntlMessages id='common.company' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              id='btnMui123'
              sx={{
                position: 'relative',
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              type='submit'
            >
              <IntlMessages id='common.saveChanges' />
            </Button>
            {/* <Button id='btnMui123'
              sx={{
                position: 'relative',
                minWidth: 100,
                ml: 2.5,
              }}
              color='primary'
              variant='outlined'
              type='cancel'
              onClick={()=>{navigate('/dashboard');}}
            >
              <IntlMessages id='common.cancel' />
            </Button> */}
          </Box>
        </Grid>
      </AppGridContainer>
    </Form>
  );
};

export default PersonalInfoForm;
PersonalInfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
};
