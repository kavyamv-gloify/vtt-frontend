import React from 'react';
import {useThemeContext} from '../../../../utility/AppContextProvider/ThemeContextProvider';
import {alpha, Box} from '@mui/material';
import {ReactComponent as Logo} from '../../../../../assets/icon/logo.svg';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {ReactComponent as LogoText} from '../../../../../assets/icon/logo_text.svg';
import axios from 'axios';
import Api from '@api';
const AppLogo = () => {
  const {theme} = useThemeContext();
  const {user} = useAuthUser();
  return (
    <Box
      sx={{
        height: {xs: 56, sm: 70},
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          height: {xs: 40, sm: 45},
        },
      }}
      className='app-logo'
    >
      <img
        src='/assets/images/tm-logo.jpeg'
        style={{width: '150px'}}
        onClick={() => {
          if (user?.userList?.userRole != 'SUPERADMIN') return;
          let postData = {
            authToken: localStorage.getItem('token'),
            userRole: 'SUPERADMIN',
            corporateId: '',
            tanentId: '',
            tanentName: '',
            tenentCode: '',
            isImpersonate: '',
          };
          axios
            .post(Api.baseUri + '/userauth/switchUserRoleTest1', postData)
            .then((resp) => {
              if (resp?.status == '200') {
                localStorage.setItem('token', resp?.data?.data?.authToken);
                window.location.href = `/dashboard`;
              }
            })
            .catch((err) => {});
        }}
      />
      {/* <Logo fill={theme.palette.primary.main} />
      <Box
        sx={{
          mt: 1,
          display: {xs: 'none', md: 'block'},
          '& svg': {
            height: {xs: 25, sm: 30},
          },
        }}
      >
        <LogoText fill={alpha(theme.palette.text.primary, 0.8)} />
      </Box> */}
    </Box>
  );
};

export default AppLogo;
